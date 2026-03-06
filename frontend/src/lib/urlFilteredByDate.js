export function urlFilteredByDate(status, date) {
  const startLocal = new Date(`${date}T00:00:00`);
  const endLocal = new Date(`${date}T00:00:00`);
  endLocal.setDate(endLocal.getDate() + 1);

  return `/api/orders?status=${status}&start=${startLocal.toISOString()}&end=${endLocal.toISOString()}`;
}
