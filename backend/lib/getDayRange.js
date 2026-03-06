const getToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const getYesterday = () => {
  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setHours(0, 0, 0, 0);

  return { start, end };
};

module.exports = { getToday, getYesterday };
