import { Endpoint } from "../../../types/src/endpoints.ts";
import { HTTPClient, RequestOptions } from "./http_client.ts";

export class RESTClient extends HTTPClient {
  async delete<T>(endpoint: Endpoint, options?: RequestOptions) {
    return this.request("DELETE", endpoint, options) as Promise<T>;
  }
  async get<T>(endpoint: Endpoint, options?: RequestOptions) {
    return this.request("GET", endpoint, options) as Promise<T>;
  }
  async patch<T>(endpoint: Endpoint, options?: RequestOptions) {
    return this.request("PATCH", endpoint, options) as Promise<T>;
  }
  async post<T>(endpoint: Endpoint, options?: RequestOptions) {
    return this.request("POST", endpoint, options) as Promise<T>;
  }
  async put<T>(endpoint: Endpoint, options?: RequestOptions) {
    return this.request("PUT", endpoint, options) as Promise<T>;
  }
}
