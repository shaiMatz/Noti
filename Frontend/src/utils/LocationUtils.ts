// utils/LocationUtils.ts

/**
 * Calculates the distance between two coordinates in kilometers.
 * @param lat1 Latitude of the first coordinate
 * @param lon1 Longitude of the first coordinate
 * @param lat2 Latitude of the second coordinate
 * @param lon2 Longitude of the second coordinate
 * @returns Distance in kilometers
 */
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  function deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }
  