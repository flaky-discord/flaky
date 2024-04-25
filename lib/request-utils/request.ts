import { request as httpRequest } from 'undici';

import type {
    RequestResponse,
    HttpMethod,
    DefaultErrorType,
    DefaultResultsType,
} from './typings.d.ts';

const isClientRequestError = (code: number): boolean =>
    code >= 400 && code < 500;

export async function request<T = DefaultResultsType, E = DefaultErrorType>(
    url: string,
    method: HttpMethod,
    options?: object,
): Promise<RequestResponse<T, E>> {
    const { body: responseBody, statusCode } = await httpRequest(url, {
        method,
        ...options,
    });

    if (statusCode !== 200) {
        const errorBody = (
            responseBody && isClientRequestError(statusCode)
                ? await responseBody.json()
                : null
        ) as E;

        return {
            ok: false,
            error: errorBody,
        };
    }

    let data: T;
    try {
        data = (await responseBody.json()) as T;
    } catch {
        data = (await responseBody.text()) as T;
    }

    return {
        ok: true,
        results: data,
    };
}

export const getRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'GET', options);
export const headRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'HEAD', options);
export const postRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'POST', options);
export const putRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'PUT', options);
export const deleteRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'DELETE', options);
export const connectRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'CONNECT', options);
export const optionsRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'OPTIONS', options);
export const traceRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'TRACE', options);
export const patchRequest = <T, E = DefaultErrorType>(
    url: string,
    options?: object,
) => request<T, E>(url, 'PATCH', options);
