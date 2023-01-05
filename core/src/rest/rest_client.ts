import { Endpoint } from "../../../types/src/endpoints.ts";
import { HTTPClient, RequestOptions } from "./http_client.ts";

export class RESTClient extends HTTPClient {
  async delete<T>(endpoint: Endpoint, options?: RequestOptions) {
    return await this.request<T>("DELETE", endpoint, options);
  }
  async get<T>(endpoint: Endpoint, options?: RequestOptions) {
    return await this.request<T>("GET", endpoint, options);
  }
  async patch<T>(endpoint: Endpoint, options?: RequestOptions) {
    return await this.request<T>("PATCH", endpoint, options);
  }
  async post<T>(endpoint: Endpoint, options?: RequestOptions) {
    return await this.request<T>("POST", endpoint, options);
  }
  async put<T>(endpoint: Endpoint, options?: RequestOptions) {
    return await this.request<T>("PUT", endpoint, options);
  }
}
