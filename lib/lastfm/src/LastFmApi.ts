import { LastFmArtistApi } from './LastFmArtistApi';
import { REST } from './REST';

export class LastFmApi {
    public apiKey: string;
    public rest: REST;

    public artist: LastFmArtistApi;

    public constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.rest = new REST(this.apiKey);

        this.artist = new LastFmArtistApi(this);
        // this.track = new LastFmTrackApi(this.apiKey);
        // this.album = new LastFmAlbumApi(this.apiKey);
    }
}
