import { request as httpRequest } from 'undici';

import type {
    RequestResponse,
    HttpMethod,
    DefaultErrorType,
} from './typings.d.ts';

const isClientRequestError = (code: number): boolean =>
    code >= 400 && code < 500;

export async function request<T = object, E = DefaultErrorType>(
    url: string,
    method: HttpMethod,
    body?: object,
): Promise<RequestResponse<T, E>> {
    const { body: responseBody, statusCode } = await httpRequest(url, {
        method,
        body: body ? JSON.stringify(body) : null,
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

    const data = (await responseBody.json()) as T;

    return {
        ok: true,
        results: data,
    };
}

export const getRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'GET', body);
export const headRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'HEAD', body);
export const postRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'POST', body);
export const putRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'PUT', body);
export const deleteRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'DELETE', body);
export const connectRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'CONNECT', body);
export const optionsRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'OPTIONS', body);
export const traceRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'TRACE', body);
export const patchRequest = <T, E = DefaultErrorType>(
    url: string,
    body?: object,
) => request<T, E>(url, 'PATCH', body);
