const prisma = require("../../../lib/prisma");
const cloudinary = require("../../../lib/cloudinary");

exports.getAllItems = async (id) => {
  return await prisma.item.findMany({
    where: { ownerId: id },
    orderBy: { createdAt: "asc" },
  });
};

exports.createItem = async ({
  name,
  price,
  mediaUrl,
  mediaId,
  mediaType,
  ownerId,
}) => {
  if (price < 0) throw new Error("PRICE_CANNOT_BE_NEGATIVE");

  return await prisma.item.create({
    data: { name, price, mediaUrl, mediaId, mediaType, ownerId },
  });
};

exports.updateItem = async ({
  itemId,
  name,
  price,
  mediaUrl,
  mediaId,
  mediaType,
  ownerId,
}) => {
  if (price !== undefined && price < 0)
    throw new Error("PRICE_CANNOT_BE_NEGATIVE");

  const existingItem = await prisma.item.findUnique({
    where: { id_ownerId: { id: itemId, ownerId } },
  });

  const oldMediaId = existingItem.mediaId;
  const mediaWasReplaced = oldMediaId && mediaId && oldMediaId !== mediaId;
  const mediaWasRemoved = oldMediaId && !mediaId;

  if (mediaWasReplaced || mediaWasRemoved) {
    await cloudinary.uploader.destroy(oldMediaId, {
      resource_type: "image",
    });
  }

  try {
    return await prisma.item.update({
      where: {
        id_ownerId: { id: itemId, ownerId },
      },
      data: { name, price, mediaUrl, mediaId, mediaType },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("ITEM_NOT_FOUND");
    }
    throw error;
  }
};

exports.deleteItem = async ({ itemId, ownerId }) => {
  const item = await prisma.item.findUnique({
    where: { id_ownerId: { id: itemId, ownerId } },
  });

  if (item.mediaId) {
    await cloudinary.uploader.destroy(item.mediaId, {
      resource_type: "image",
    });
  }

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
