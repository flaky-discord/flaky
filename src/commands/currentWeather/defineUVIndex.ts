import { UVIndex } from '../../typings';

// @ts-ignore
export function defineUVIndex(uvIndex: number): UVIndex {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Medium';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    if (uvIndex > 10) return 'Extreme';
}
