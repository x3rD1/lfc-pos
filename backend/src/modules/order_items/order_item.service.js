const prisma = require("../../../lib/prisma");

exports.create_order_item = async ({ itemId, orderId, ownerId }) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({ where: { id: orderId, ownerId } });
    if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

    const item = await tx.item.findFirst({ where: { id: itemId, ownerId } });
    if (!item) throw new Error("ITEM_NOT_FOUND");

    let order_item = await tx.order_item.findFirst({
      where: { itemId, orderId },
    });

    if (order_item) {
      order_item = await tx.order_item.update({
        where: { id: order_item.id },
        data: { quantity: { increment: 1 } },
      });
    } else {
      order_item = await tx.order_item.create({
        data: {
          name_at_order: item.name,
          price_at_order: item.price,
          image_at_order: item.image,
          quantity: 1,
          itemId: item.id,
          orderId,
        },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: { total: { increment: item.price } },
    });

    return order_item;
  });
};

exports.update_order_item = async ({ itemId, orderId }) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({ where: { id: orderId } });
    if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

    const existing = await tx.order_item.findFirst({
      where: { itemId, orderId },
    });
    if (!existing) throw new Error("ITEM_NOT_FOUND");

    await tx.order.update({
      where: { id: orderId },
      data: { total: { decrement: existing.price_at_order } },
    });

    if (existing.quantity === 1) {
      await tx.order_item.delete({ where: { id: existing.id } });
      return { deleted: true, itemId };
    } else {
      const updated = await tx.order_item.update({
        where: { id: existing.id },
        data: { quantity: { decrement: 1 } },
      });
      return updated;
    }
  });
};

exports.delete_order_item = async ({ itemId, orderId }) => {
  const order = await prisma.order.findFirst({ where: { id: orderId } });
  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  const order_item = await prisma.order_item.findFirst({
    where: { itemId, orderId },
  });
  if (!order_item) throw new Error("ITEM_NOT_FOUND");

  await prisma.$transaction(async (tx) => {
    await tx.order_item.delete({ where: { id: order_item.id } });
    await tx.order.update({
      where: { id: orderId },
      data: {
        total: { decrement: order_item.price_at_order * order_item.quantity },
      },
    });
  });

  return { deleted: true, itemId };
};
