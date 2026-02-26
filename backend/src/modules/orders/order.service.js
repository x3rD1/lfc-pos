const prisma = require("../../../lib/prisma");

exports.getAllOrders = async (ownerId) => {
  return await prisma.order.findMany({ where: { ownerId } });
};

exports.getOrder = async ({ orderId, ownerId }) => {
  const order = await prisma.order.findUnique({
    where: { id_ownerId: { id: orderId, ownerId } },
  });

  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  return order;
};

exports.createOrder = async (ownerId) => {
  const user = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!user) throw new Error("USER_DO_NOT_EXISTS");

  return await prisma.order.create({ data: { ownerId } });
};

exports.deleteOrder = async ({ orderId, ownerId }) => {
  const order = await prisma.order.findUnique({
    where: { id_ownerId: { id: orderId, ownerId } },
  });

  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  return await prisma.order.delete({
    where: { id_ownerId: { id: orderId, ownerId } },
  });
};
