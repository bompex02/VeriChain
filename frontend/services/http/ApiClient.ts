import type { ApiRequestBody } from '../../types/http';

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    return await $fetch<T>(this.buildUrl(path));
  }

  async post<TResponse, TBody extends ApiRequestBody>(path: string, body: TBody): Promise<TResponse> {
    return await $fetch<TResponse>(this.buildUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
