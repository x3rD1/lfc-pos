function getLastMonthRange() {
  const today = new Date();

  const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const lastDayLastMonth = new Date(firstDayThisMonth);
  lastDayLastMonth.setDate(0);

  const firstDayLastMonth = new Date(
    lastDayLastMonth.getFullYear(),
    lastDayLastMonth.getMonth(),
    1,
  );

  return { start: firstDayLastMonth, end: lastDayLastMonth };
}

function getThisMonthRange() {
  const today = new Date();

  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  const end = new Date();
  end.setHours(24, 0, 0, 0);

  return { start, end };
}

module.exports = { getLastMonthRange, getThisMonthRange };
