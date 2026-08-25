export type GeoPoint = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_METERS = 6_371_008.8;
export const DELIVERY_DISTANCE_COEFFICIENT = 1.3;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function calculateGeodesicDistanceMeters(
  origin: GeoPoint,
  destination: GeoPoint
) {
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const latitudeDelta = destinationLatitude - originLatitude;
  const longitudeDelta = toRadians(
    destination.longitude - origin.longitude
  );

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  const normalizedHaversine = Math.min(1, Math.max(0, haversine));
  const centralAngle =
    2 *
    Math.atan2(
      Math.sqrt(normalizedHaversine),
      Math.sqrt(1 - normalizedHaversine)
    );

  return Math.round(EARTH_RADIUS_METERS * centralAngle);
}

export function calculateEstimatedDeliveryDistanceMeters(
  origin: GeoPoint,
  destination: GeoPoint
) {
  return Math.round(
    calculateGeodesicDistanceMeters(origin, destination) *
      DELIVERY_DISTANCE_COEFFICIENT
  );
}
