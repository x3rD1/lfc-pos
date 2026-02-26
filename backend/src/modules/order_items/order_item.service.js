const prisma = require("../../../lib/prisma");

exports.create_order_item = async ({ itemId, orderId, ownerId }) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

    const item = await tx.item.findUnique({
      where: { id_ownerId: { id: itemId, ownerId } },
    });

    if (!item) throw new Error("ITEM_NOT_FOUND");

    // Checks if an order_item with itemId already exists, increment quantity by 1 if yes, create if not
    const order_item = await tx.order_item.upsert({
      where: { itemId_orderId: { itemId, orderId } },
      update: { quantity: { increment: 1 } },
      create: {
        name_at_order: item.name,
        price_at_order: item.price,
        image_at_order: item.image,
        quantity: 1,
        itemId: item.id,
        orderId,
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        total: {
          increment: item.price,
        },
      },
    });

    return order_item;
  });
};

exports.update_order_item = async ({ itemId, orderId }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.order_item.findUnique({
      where: { itemId_orderId: { itemId, orderId } },
    });

    if (!existing) throw new Error("ITEM_NOT_FOUND");

    if (existing.quantity === 1) {
      await tx.order_item.delete({
        where: { itemId_orderId: { itemId, orderId } },
      });
    } else {
      await tx.order_item.update({
        where: { itemId_orderId: { itemId, orderId } },
        data: {
          quantity: { decrement: 1 },
        },
      });
    }
  });

  return updated;
};

exports.delete_order_item = async ({ itemId, orderId }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("ORDER_DO_NOT_EXISTS");

  const order_item = await prisma.order_item.findUnique({
    where: { itemId_orderId: { itemId, orderId } },
    select: { id: true },
  });

  if (!order_item) throw new Error("ITEM_NOT_FOUND");

  return await prisma.order_item.delete({
    where: { itemId_orderId: { itemId, orderId } },
  });
};
