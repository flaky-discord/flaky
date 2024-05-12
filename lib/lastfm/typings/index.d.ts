import { ArtistInfo } from './api';

export class LastFmApi {
    public constructor(apiKey: string);
    public apiKey: string;
    public artist: LastFmArtistApi;
    public rest: REST;
}

export class LastFmArtistApi {
    public constructor(apiKey: string);
    public fm: LastFmApi;
    public getInfo(artistName: string, autocorrect?: true): Promise<ArtistInfo>;
}

export class LastFmApiError extends Error {
    public constructor(error: RESTLastFmApiError);
    public code: number | null;
}

export interface LastFmApiErrorOptions {
    message: string;
    statusCode: number;
}

export interface RESTLastFmApiError extends LastFmApiErrorOptions {
    error?: number;
}

export interface RequestOptions {
    body?: object;
    headers?: object;
}

export type MethodOptions = 'GET';
