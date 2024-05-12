import { Artist } from './Routes';
import {
    ArtistInfo,
    LastFmImage,
    RESTLastFmApiArtistInfo,
    RESTLastFmApiImage,
} from '../typings/api';
import { LastFmApi } from './LastFmApi';

export class LastFmArtistApi {
    public fm: LastFmApi;

    public constructor(lastfm: LastFmApi) {
        this.fm = lastfm;
    }

    public async getInfo(
        artistName: string,
        autocorrect?: boolean,
    ): Promise<ArtistInfo> {
        const url = autocorrect
            ? Artist.getInfo(artistName, this.fm.apiKey, true)
            : Artist.getInfo(artistName, this.fm.apiKey);

        const {
            artist,
            artist: { image },
        } = await this.fm.rest.get<RESTLastFmApiArtistInfo>(url);

        return {
            ...artist,
            image: this.resolveImages(image),
        };
    }

    public resolveImages(images: RESTLastFmApiImage[]): LastFmImage {
        const imageObj = {} as LastFmImage;

        for (const image of images) {
            if (!image.size.length) continue;
            imageObj[image.size] = image['#text'];
        }

        return imageObj;
    }
}
