const prisma = require("../../../lib/prisma");

exports.getAllOrFilteredOrders = async ({ ownerId, status, start, end }) => {
  const where = { ownerId };

  if (status) {
    where.status = status;
  }

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    where.updatedAt = {
      gte: startDate,
      lt: endDate,
    };
  }

  return prisma.order.findMany({
    where,
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
};

exports.getOrder = async ({ orderId, ownerId }) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, ownerId },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  return order;
};

exports.createOrder = async (ownerId) => {
  const user = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!user) throw new Error("USER_DO_NOT_EXISTS");

  const existing = await prisma.order.findFirst({
    where: { ownerId, status: "OPEN" },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (existing) return existing;

  try {
    return await prisma.order.create({
      data: { ownerId, status: "OPEN" },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });
  } catch (err) {
    return await prisma.order.findFirst({
      where: { ownerId, status: "OPEN" },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });
  }
};

exports.updateOrderStatus = async ({ orderId, ownerId, status }) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, ownerId },
  });

  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  return await prisma.order.updateMany({
    where: { id: orderId, ownerId },
    data: { status },
  });
};

exports.deleteOrder = async ({ orderId, ownerId }) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, ownerId },
  });

  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  return await prisma.order.deleteMany({ where: { id: orderId, ownerId } });
};
