import { REGIONS } from "../constants";
import { ActiveRegion } from "../models";

const getMinDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = p2 - p1;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const a =
    Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;
};

const getClosestRegion = (lat: number, long: number): ActiveRegion => {
  return REGIONS.map((region) => {
    const minDistance = getMinDistance(
      Number(lat),
      Number(long),
      Number(region?.Latitude),
      Number(region?.Longitude)
    );
    return {
      minDistance,
      region: region.RegionName,
    };
  }).reduce((acc, current, index) => {
    if (index === 0) {
      return current;
    }

    return acc.minDistance > current.minDistance ? current : acc;
  }, {minDistance: 0, region: ""});
};

export { getClosestRegion };
