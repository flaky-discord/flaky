export type GetRequestResponse<T = unknown, E = object | undefined | null> = {
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
