import { request } from 'undici';

import { UserAgent } from './Constants';
import { LastFmApiError } from './LastFmApiError';
import { MethodOptions, RESTLastFmApiError, RequestOptions } from '../typings';

const isServerError = (code: number): boolean => code >= 500 && code < 599;
const isUnsuccessfulResponseCode = (code: number): boolean =>
    code < 200 || code > 299;

export class REST {
    public apiKey: string;
    public headers: object;

    public constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.headers = {
            'User-Agent': UserAgent,
        };
    }

    public async request<T>(
        route: string,
        method: MethodOptions,
        options?: RequestOptions,
    ) {
        const headers = {
            ...this.headers,
            ...options?.headers,
        };

        let bodyOption = null;
        if (options?.body) bodyOption = JSON.stringify(options.body);

        const { body, statusCode } = await request(route, {
            method,
            headers,
            body: bodyOption,
        });

        if (
            isServerError(statusCode) ||
            isUnsuccessfulResponseCode(statusCode)
        ) {
            throw new LastFmApiError({
                message: 'Lastfm API Server Error',
                statusCode,
            });
        }

        const response = (await body.json()) as RESTLastFmApiError | T;

        // @ts-ignore
        if (response?.error !== undefined) {
            const { error, message } = response as RESTLastFmApiError;
            throw new LastFmApiError({
                error,
                message,
                statusCode,
            });
        }

        return response as T;
    }

    public async get<T>(route: string, options?: RequestOptions) {
        return this.request<T>(route, 'GET', options);
    }
}
