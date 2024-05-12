import { RESTLastFmApiError } from '../typings';

export class LastFmApiError extends Error {
    public code: number | null;

    public constructor(error: RESTLastFmApiError) {
        super(error.message);

        this.name = `LastFmApiError${error?.error ? `[${error.error}]` : ''}`;
        this.message = error.message;
        this.code = error?.error ? error.error : null;
    }
}
