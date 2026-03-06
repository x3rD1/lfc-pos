const {
  getThisMonthRange,
  getLastMonthRange,
} = require("../../../lib/getMonthlyRange");
const { getToday, getYesterday } = require("../../../lib/getDayRange");
const prisma = require("../../../lib/prisma");

const { start, end } = getToday();

const mostPopular = async (ownerId) => {
  const popularItem = await prisma.order_item.groupBy({
    by: ["itemId"],
    where: {
      order: {
        ownerId,
        status: "COMPLETED",
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 1,
  });

  if (!popularItem.length) {
    return {
      name: null,
      quantity: 0,
    };
  }

  const item = await prisma.item.findUnique({
    where: { id_ownerId: { id: popularItem[0].itemId, ownerId } },
  });

  return {
    name: item.name,
    quantity: popularItem[0]._sum.quantity,
  };
};

const leastPopular = async (ownerId) => {
  const least_popular = await prisma.order_item.groupBy({
    by: ["itemId"],
    where: {
      order: {
        ownerId,
        status: "COMPLETED",
        createdAt: { gte: start, lt: end },
      },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: -1,
  });

  if (!least_popular.length) {
    return {
      name: null,
      quantity: 0,
    };
  }

  const item = await prisma.item.findUnique({
    where: { id_ownerId: { id: least_popular[0].itemId, ownerId } },
  });

  return {
    name: item.name,
    quantity: least_popular[0]._sum.quantity,
  };
};

const totalRevenue = async (ownerId) => {
  const todayRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      ownerId,
      status: "COMPLETED",
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  const yesterdayRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      ownerId,
      status: "COMPLETED",
      createdAt: {
        gte: getYesterday().start,
        lt: getYesterday.end,
      },
    },
  });

  const thisMonthRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      ownerId,
      status: "COMPLETED",
      createdAt: {
        gte: getThisMonthRange().start,
        lt: getThisMonthRange().end,
      },
    },
  });

  const lastMonthRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      ownerId,
      status: "COMPLETED",
      createdAt: {
        gte: getLastMonthRange().start,
        lt: getLastMonthRange().end,
      },
    },
  });

  return {
    today: todayRevenue._sum,
    yesterday: yesterdayRevenue._sum,
    thisMonth: thisMonthRevenue._sum,
    lastMonth: lastMonthRevenue._sum,
  };
};

const revenueComparison = async (ownerId) => {
  const revenue = await totalRevenue(ownerId);

  const dailyComparison = () => {
    const prevValue = revenue.yesterday?.total || 0;
    const currValue = revenue.today?.total || 0;

    const nowVsYesterday =
      prevValue === 0
        ? currValue === 0
          ? 0
          : 100
        : ((currValue - prevValue) / prevValue) * 100;

    return nowVsYesterday;
  };

  const monthlyComparison = () => {
    const lastMonthValue = revenue.lastMonth?.total || 0;
    const thisMonthValue = revenue.thisMonth?.total || 0;

    const lastMonthVsThisMonth =
      lastMonthValue === 0
        ? thisMonthValue === 0
          ? 0
          : 100
        : ((lastMonthValue - thisMonthValue) / thisMonthValue) * 100;

    return lastMonthVsThisMonth;
  };

  return { daily: dailyComparison(), monthly: monthlyComparison() };
};

const orderOverTime = async (ownerId) => {
  const ordersPerHourRaw = await prisma.$queryRaw`
    SELECT DATE_PART('hour', "createdAt") AS hour, COUNT(*) AS total
    FROM "orders"
    WHERE "status" = 'COMPLETED'
      AND "ownerId" = ${ownerId}
      AND "createdAt" BETWEEN ${start} AND ${end}
    GROUP BY hour
    ORDER BY hour;
  `;

  const fullDay = Array.from({ length: 24 }, (_, i) => i);

  const ordersPerHour = fullDay.map((hour) => {
    const found = ordersPerHourRaw.find((o) => Number(o.hour) === hour);
    return {
      hour,
      total: found ? Number(found.total) : 0,
    };
  });

  const thisMonthOrders = await prisma.$queryRaw`
  SELECT DATE("createdAt") AS day, COUNT(*) AS total
  FROM "orders"
  WHERE "status" = 'COMPLETED'
    AND "createdAt" BETWEEN ${getThisMonthRange().start} AND ${getThisMonthRange().end}
  GROUP BY day
  ORDER BY day;
`;

  const getAllDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const fillMonthlyOrders = (ordersRaw, year, month) => {
    const allDays = getAllDaysInMonth(year, month);

    return allDays.map((day) => {
      const dayStr = day.toISOString().split("T")[0];
      const found = ordersRaw.find(
        (o) => new Date(o.day).toISOString().split("T")[0] === dayStr,
      );
      return { day: dayStr, total: found ? Number(found.total) : 0 };
    });
  };

  const today = new Date();
  const formattedOrders = fillMonthlyOrders(
    thisMonthOrders,
    today.getFullYear(),
    today.getMonth(),
  );

  return { today: ordersPerHour, thisMonth: formattedOrders };
};

const productRevenue = async () => {
  const thiMonthRevenueRaw = await prisma.$queryRaw`
    SELECT i.name, SUM(oi.price_at_order * oi.quantity) AS revenue
    FROM "order_items" oi
    JOIN "orders" o ON o.id = oi."orderId"
    JOIN "items" i ON i.id = oi."itemId"
    WHERE o.status = 'COMPLETED'
      AND oi."itemId" IS NOT NULL
      AND o."createdAt" BETWEEN ${getThisMonthRange().start} AND ${getThisMonthRange().end}
    GROUP BY i.id, i.name
    ORDER BY revenue DESC;
  `;

  const dailyRevenueRaw = await prisma.$queryRaw`
    SELECT i.name, SUM(oi.price_at_order * oi.quantity) AS revenue
    FROM "order_items" oi
    JOIN "orders" o ON o.id = oi."orderId"
    JOIN "items" i ON i.id = oi."itemId"
    WHERE o.status = 'COMPLETED'
      AND oi."itemId" IS NOT NULL
      AND o."createdAt" BETWEEN ${start} AND ${end}
    GROUP BY i.id, i.name
    ORDER BY revenue DESC;
  `;

  const formattedRevenue = (array) =>
    array.map((p) => ({
      name: p.name,
      revenue: Number(p.revenue),
    }));

  return {
    today: formattedRevenue(dailyRevenueRaw),
    thisMonth: formattedRevenue(thiMonthRevenueRaw),
  };
};

const peakOrderingTime = async (ownerId) => {
  const result = async (startDate, endDate) => {
    const orders = await prisma.order.findMany({
      where: {
        ownerId,
        status: "COMPLETED",
        createdAt: { gte: startDate, lt: endDate },
      },
      select: { createdAt: true },
    });

    if (!orders.length) return null;

    const secondsSinceMidnight = orders.map((order) => {
      const date = order.createdAt;
      return (
        date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
      );
    });

    // Compute average
    const avgSeconds =
      secondsSinceMidnight.reduce((sum, sec) => sum + sec, 0) /
      secondsSinceMidnight.length;

    // Convert back to hours, minutes, seconds
    const avgHours = Math.floor(avgSeconds / 3600);
    const avgMinutes = Math.floor((avgSeconds % 3600) / 60);
    const avgSecondsRemaining = Math.floor(avgSeconds % 60);

    // Format as HH:MM:SS or 12-hour format
    const avgTime = `${avgHours.toString().padStart(2, "0")}:${avgMinutes
      .toString()
      .padStart(2, "0")}:${avgSecondsRemaining.toString().padStart(2, "0")}`;

    return avgTime;
  };

  return {
    today: await result(start, end),
    thisMonth: await result(getThisMonthRange().start, getThisMonthRange().end),
  };
};

exports.summary = async (ownerId) => {
  const result = {
    most_popular: await mostPopular(ownerId),
    least_popular: await leastPopular(ownerId),
    total_revenue: await totalRevenue(ownerId),
    revenue_comparison: await revenueComparison(ownerId),
    order_over_time: await orderOverTime(ownerId),
    product_revenue: await productRevenue(),
    peak_ordering_time: await peakOrderingTime(ownerId),
  };
  return result;
};
