export type DefaultErrorType = object | undefined | null;

export type RequestResponse<T = unknown, E = DefaultErrorType> = {
    ok: boolean;
    error?: E;
    results?: T;
};

export type HttpMethod =
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';
