export class DiscordAPIError extends Error {
  status: number;
  body: string;

  constructor(
    status = 400,
    body: string,
    ...params: ConstructorParameters<typeof Error>
  ) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DiscordAPIError);
    }

    this.name = "DiscordAPIError";
    this.status = status;
    this.body = body;
  }
}

export class DiscordAPIInternalError extends Error {
  status: number;

  constructor(status = 500, ...params: ConstructorParameters<typeof Error>) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DiscordAPIInternalError);
    }

    this.name = "DiscordAPIInternalError";
    this.status = status;
  }
}

export class DiscordAPITimeoutError extends Error {
  timeout: number;

  constructor(timeout = 10000, ...params: ConstructorParameters<typeof Error>) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DiscordAPITimeoutError);
    }

    this.name = "DiscordAPITimeoutError";
    this.timeout = timeout;
  }
}
