export const Base = 'https://ws.audioscrobbler.com/2.0';

export const Artist = {
    getInfo: (name: string, apiKey: string, autocorrect?: boolean) => {
        const baseUrl = `${Base}/?method=artist.getinfo`;
        const params = new URLSearchParams();
        params.append('artist', name);
        params.append('api_key', apiKey);

        if (autocorrect) params.append('autocorrect', '1');

        params.append('format', 'json');
        return `${baseUrl}&${params.toString()}`;
    },
};
