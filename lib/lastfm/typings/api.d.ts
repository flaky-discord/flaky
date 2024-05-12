export type RESTLastFmApiImageSize =
    | 'small'
    | 'medium'
    | 'large'
    | 'extralarge'
    | 'mega';

export interface ArtistStats {
    listeners: string;
    playcount: string;
}

export interface ArtistTag {
    name: string;
    url: string;
}

export interface ArtistBio extends RESTBaseInformation {}

export interface RESTLastFmApiImage {
    '#text': string;
    size: RESTLastFmApiImageSize;
}

export interface LastFmImage {
    small: string;
    medium: string;
    large: string;
    extralarge: string;
    mega: string;
}

export interface ArtistInfo extends RESTBaseArtist {
    image: LastFmImage;
    streamable: number;
    stats: ArtistStats;
    similar: {
        artist: {
            name: string;
            url: string;
        };
    };
    tags: ArtistTag[];
    bio: ArtistBio;
}

export interface TrackInfo {
    id: string;
    name: string;
    url: string;
    duration: number;
    listeners: string;
    playcount: string;
    artist: RESTBaseArtist;
}

export interface RESTBaseInformation {
    published: Date;
    summary: string;
    content: string;
}

export interface RESTBaseArtist {
    name: string;
    mbid: string;
    url: string;
}

export interface RESTLastFmApiArtistInfo {
    artist: {
        name: string;
        mbid: string;
        url: string;
        image: RESTLastFmApiImage[];
        streamable: number;
        stats: ArtistStats;
        similar: {
            artist: {
                name: string;
                url: string;
            };
        };
        tags: ArtistTag[];
        bio: ArtistBio;
    };
}

export interface RESTLastFmApiTrackInfo {
    track: {
        id: string;
        name: string;
        url: string;
        duration: number;
        listeners: string;
        playcount: string;
        artist: RESTBaseArtist;
    };
}
