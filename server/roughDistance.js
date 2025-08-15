// Quick zips-only rough distance using centroid approximations (fallback).
// Replace with a real distance service later.
export async function roughDistanceMiles(zipA, zipB) {
  if (!zipA || !zipB) return 500; // default
  // naive heuristic: difference in numeric zips * 1.2 (nonsense but stable for MVP)
  const a = parseInt(zipA.slice(0,5).replace(/\D/g,'')) || 10000;
  const b = parseInt(zipB.slice(0,5).replace(/\D/g,'')) || 20000;
  const miles = Math.min(Math.max(Math.abs(a - b) * 0.12, 50), 2800);
  return Math.round(miles);
}
