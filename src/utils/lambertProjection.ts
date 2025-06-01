export function lambertProjection(lng: number, lat: number): [number, number] {
  const origin_lat = 39 * Math.PI / 180;
  const origin_lng = -96 * Math.PI / 180;
  const lat1 = 33 * Math.PI / 180;
  const lat2 = 45 * Math.PI / 180;
  
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;
  
  const n = Math.log(Math.cos(lat1) / Math.cos(lat2)) / 
            Math.log(Math.tan(Math.PI/4 + lat2/2) / Math.tan(Math.PI/4 + lat1/2));
  
  const F = Math.cos(lat1) * Math.pow(Math.tan(Math.PI/4 + lat1/2), n) / n;
  const rho0 = F / Math.pow(Math.tan(Math.PI/4 + origin_lat/2), n);
  const rho = F / Math.pow(Math.tan(Math.PI/4 + latRad/2), n);
  const theta = n * (lngRad - origin_lng);
  
  const x = rho * Math.sin(theta);
  const y = rho0 - rho * Math.cos(theta);
  
  const scaleX = x / 2000000;
  const scaleY = y / 1500000;
  
  return [scaleX, scaleY];
}
