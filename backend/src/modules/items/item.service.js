const prisma = require("../../../lib/prisma");

exports.getAllItems = async (id) => {
  return await prisma.item.findMany({ where: { ownerId: id } });
};

exports.createItem = async ({ name, price, image, ownerId }) => {
  if (price < 0) throw new Error("PRICE_CANNOT_BE_NEGATIVE");

  return await prisma.item.create({
    data: { name, price, image, ownerId },
  });
};

exports.updateItem = async ({ itemId, name, price, image, ownerId }) => {
  if (price !== undefined && price < 0)
    throw new Error("PRICE_CANNOT_BE_NEGATIVE");

  try {
    return await prisma.item.update({
      where: {
        id_ownerId: { id: itemId, ownerId },
      },
      data: { name, price, image },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("ITEM_NOT_FOUND");
    }
    throw error;
  }
};

exports.deleteItem = async ({ itemId, ownerId }) => {
  try {
    return await prisma.item.delete({
      where: { id_ownerId: { id: itemId, ownerId } },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("ITEM_NOT_FOUND");
    }
    throw error;
  }
};
