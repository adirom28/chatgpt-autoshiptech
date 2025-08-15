export function quotePrice({ distance, trailerType, operable }) {
  const base = trailerType === 'enclosed' ? 1.05 : 0.70;
  let price = Math.max(distance * base, 350);
  if (!operable) price += 150;
  if (distance > 1500) price *= 0.95;
  const breakdown = `Base $${(distance*base).toFixed(2)} + modifiers`;
  return { price: Math.round(price), breakdown };
}
