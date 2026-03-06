export function dateFormat(dateString) {
  const now = new Date().toLocaleDateString("en-CA");
  if (now === dateString) return "Today";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const options = { month: "short", day: "2-digit", weekday: "short" };
  const formatted = date.toLocaleDateString("en-CA", options);

  return formatted;
}
