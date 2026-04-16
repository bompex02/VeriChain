import type { ApiRequestBody } from '../../types/http';

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
    return await $fetch<T>(this.buildUrl(path), {
      headers,
    });
  }

  async post<TResponse, TBody extends ApiRequestBody>(
    path: string,
    body: TBody,
    headers: Record<string, string> = {}
  ): Promise<TResponse> {
    return await $fetch<TResponse>(this.buildUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
    });
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
