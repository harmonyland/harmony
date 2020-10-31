import { delay } from "../utils/index.ts";
import * as baseEndpoints from "../consts/urlsAndVersions.ts";
import { Client } from "./client.ts";

export enum HttpResponseCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  TooManyRequests = 429,
  GatewayUnavailable = 502,
  // ServerError left untyped because it's 5xx.
}

export type RequestMethods =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "head"
  | "delete";

export interface QueuedRequest {
	callback: () => Promise<
		void | {
			rateLimited: any;
			beforeFetch: boolean;
			bucketID?: string | null;
		}
	>;
	bucketID?: string | null;
	url: string;
}

export interface RateLimitedPath {
	url: string;
	resetTimestamp: number;
	bucketID: string | null;
}

export class RESTManager {
	client: Client;
	globallyRateLimited: boolean = false;
	queueInProcess: boolean = false;
	pathQueues: { [key: string]: QueuedRequest[] } = {};
	ratelimitedPaths = new Map<string, RateLimitedPath>();

	constructor(client: Client) {
		this.client = client;
	}

	async processRateLimitedPaths() {
		const now = Date.now();
		this.ratelimitedPaths.forEach((value, key) => {
			if (value.resetTimestamp > now) return;
			this.ratelimitedPaths.delete(key);
			if (key === "global") this.globallyRateLimited = false;
		});

		await delay(1000);
		this.processRateLimitedPaths();
	}

	addToQueue(request: QueuedRequest) {
		const route = request.url.substring(baseEndpoints.DISCORD_API_URL.length + 1);
		const parts = route.split("/");
		// Remove the major param
		parts.shift();
		const [id] = parts;
	
		if (this.pathQueues[id]) {
			this.pathQueues[id].push(request);
		} else {
			this.pathQueues[id] = [request];
		}
	}
	
	async cleanupQueues() {
		Object.entries(this.pathQueues).map(([key, value]) => {
			if (!value.length) {
				// Remove it entirely
				delete this.pathQueues[key];
			}
		});
	}

	async processQueue() {
		if (
			(Object.keys(this.pathQueues).length) && !this.globallyRateLimited
		) {
			await Promise.allSettled(
				Object.values(this.pathQueues).map(async (pathQueue) => {
					const request = pathQueue.shift();
					if (!request) return;
	
					const rateLimitedURLResetIn = await this.checkRatelimits(request.url);
	
					if (request.bucketID) {
						const rateLimitResetIn = await this.checkRatelimits(request.bucketID);
						if (rateLimitResetIn) {
							// This request is still rate limited readd to queue
							this.addToQueue(request);
						} else if (rateLimitedURLResetIn) {
							// This URL is rate limited readd to queue
							this.addToQueue(request);
						} else {
							// This request is not rate limited so it should be run
							const result = await request.callback();
							if (result && result.rateLimited) {
								this.addToQueue(
									{ ...request, bucketID: result.bucketID || request.bucketID },
								);
							}
						}
					} else {
						if (rateLimitedURLResetIn) {
							// This URL is rate limited readd to queue
							this.addToQueue(request);
						} else {
							// This request has no bucket id so it should be processed
							const result = await request.callback();
							if (request && result && result.rateLimited) {
								this.addToQueue(
									{ ...request, bucketID: result.bucketID || request.bucketID },
								);
							}
						}
					}
				}),
			);
		}
	
		if (Object.keys(this.pathQueues).length) {
			await delay(1000);
			this.processQueue();
			this.cleanupQueues();
		} else this.queueInProcess = false;
	}

	createRequestBody(body: any, method: RequestMethods) {
		const headers: { [key: string]: string } = {
			Authorization: `Bot ${this.client.token}`,
			"User-Agent":
				`DiscordBot (discord.deno)`,
		};

		if(!this.client.token) delete headers.Authorization;
	
		if (method === "get") body = undefined;
	
		if (body?.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(body.reason);
		}
	
		if (body?.file) {
			const form = new FormData();
			form.append("file", body.file.blob, body.file.name);
			form.append("payload_json", JSON.stringify({ ...body, file: undefined }));
			body.file = form;
		} else if (
			body && !["get", "delete"].includes(method)
		) {
			headers["Content-Type"] = "application/json";
		}
	
		return {
			headers,
			body: body?.file || JSON.stringify(body),
			method: method.toUpperCase(),
		};
	}

	async checkRatelimits(url: string) {
		const ratelimited = this.ratelimitedPaths.get(url);
		const global = this.ratelimitedPaths.get("global");
		const now = Date.now();
	
		if (ratelimited && now < ratelimited.resetTimestamp) {
			return ratelimited.resetTimestamp - now;
		}
		if (global && now < global.resetTimestamp) {
			return global.resetTimestamp - now;
		}
	
		return false;
	}

	async runMethod(
		method: RequestMethods,
		url: string,
		body?: unknown,
		retryCount = 0,
		bucketID?: string | null,
	) {
	
		const errorStack = new Error("Location In Your Files:");
		Error.captureStackTrace(errorStack);
	
		return await new Promise((resolve, reject) => {
			const callback = async () => {
				try {
					const rateLimitResetIn = await this.checkRatelimits(url);
					if (rateLimitResetIn) {
						return { rateLimited: rateLimitResetIn, beforeFetch: true, bucketID };
					}
	
					const query = method === "get" && body
						? Object.entries(body as any).map(([key, value]) =>
							`${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`
						)
							.join("&")
						: "";
					const urlToUse = method === "get" && query ? `${url}?${query}` : url;

					const response = await fetch(urlToUse, this.createRequestBody(body, method));
					const bucketIDFromHeaders = this.processHeaders(url, response.headers);
					this.handleStatusCode(response, errorStack);
	
					// Sometimes Discord returns an empty 204 response that can't be made to JSON.
					if (response.status === 204) return resolve();
	
					const json = await response.json();
					if (
						json.retry_after ||
						json.message === "You are being rate limited."
					) {
						if (retryCount > 10) {
							throw new Error("Max RateLimit Retries hit");
						}
	
						return {
							rateLimited: json.retry_after,
							beforeFetch: false,
							bucketID: bucketIDFromHeaders,
						};
					}
					return resolve(json);
				} catch (error) {
					return reject(error);
				}
			};
	
			this.addToQueue({
				callback,
				bucketID,
				url,
			});
			if (!this.queueInProcess) {
				this.queueInProcess = true;
				this.processQueue();
			}
		});
	}

	async logErrors(response: Response, errorStack?: unknown) {
		try {
			const error = await response.json();
			console.error(error);
		} catch {
			console.error(response);
		}
	}

	handleStatusCode(response: Response, errorStack?: unknown) {
		const status = response.status;
	
		if (
			(status >= 200 && status < 400) ||
			status === HttpResponseCode.TooManyRequests
		) {
			return true;
		}
	
		this.logErrors(response, errorStack);
	
		switch (status) {
			case HttpResponseCode.BadRequest:
			case HttpResponseCode.Unauthorized:
			case HttpResponseCode.Forbidden:
			case HttpResponseCode.NotFound:
			case HttpResponseCode.MethodNotAllowed:
				throw new Error("Request Client Error");
			case HttpResponseCode.GatewayUnavailable:
				throw new Error("Request Server Error");
		}
	
		// left are all unknown
		throw new Error("Request Unknown Error");
	}

	processHeaders(url: string, headers: Headers) {
		let ratelimited = false;
	
		// Get all useful headers
		const remaining = headers.get("x-ratelimit-remaining");
		const resetTimestamp = headers.get("x-ratelimit-reset");
		const retryAfter = headers.get("retry-after");
		const global = headers.get("x-ratelimit-global");
		const bucketID = headers.get("x-ratelimit-bucket");
	
		// If there is no remaining rate limit for this endpoint, we save it in cache
		if (remaining && remaining === "0") {
			ratelimited = true;
	
			this.ratelimitedPaths.set(url, {
				url,
				resetTimestamp: Number(resetTimestamp) * 1000,
				bucketID,
			});
	
			if (bucketID) {
				this.ratelimitedPaths.set(bucketID, {
					url,
					resetTimestamp: Number(resetTimestamp) * 1000,
					bucketID,
				});
			}
		}
	
		// If there is no remaining global limit, we save it in cache
		if (global) {
			const reset = Date.now() + Number(retryAfter);
			this.globallyRateLimited = true;
			ratelimited = true;
	
			this.ratelimitedPaths.set("global", {
				url: "global",
				resetTimestamp: reset,
				bucketID,
			});
	
			if (bucketID) {
				this.ratelimitedPaths.set(bucketID, {
					url: "global",
					resetTimestamp: reset,
					bucketID,
				});
			}
		}
	
		return ratelimited ? bucketID : undefined;
	}

	get(url: string, body?: unknown) {
    return this.runMethod("get", url, body);
  }

  post(url: string, body?: unknown) {
    return this.runMethod("post", url, body);
  }

  delete(url: string, body?: unknown) {
    return this.runMethod("delete", url, body);
  }

  patch(url: string, body?: unknown) {
    return this.runMethod("patch", url, body);
  }

  put(url: string, body?: unknown) {
    return this.runMethod("put", url, body);
  }
}