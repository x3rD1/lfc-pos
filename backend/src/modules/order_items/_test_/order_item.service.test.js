const prisma = require("../../../../lib/prisma");
const order_itemService = require("../order_item.service");

jest.mock("../../../../lib/prisma", () => ({
  order_item: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  item: {
    findUnique: jest.fn(),
  },
}));

describe("Order_item service", () => {
  it("should throw an error when item does not exist", async () => {
    prisma.item.findUnique.mockResolvedValue(null);

    await expect(
      order_itemService.create_order_item({
        name_at_order: "Lumpia",
        quantity: 2,
        price_at_order: 40.0,
        image_at_order: "1.png",
        itemId: "1",
        orderId: "1",
      }),
    ).rejects.toThrow("ITEM_NOT_FOUND");
  });

  it("should create an order_item when item exists", async () => {
    prisma.item.findUnique.mockResolvedValue({ id: "2" });
    prisma.order_item.create.mockResolvedValue({ id: "3" });

    const result = await order_itemService.create_order_item({
      id: "3",
      name_at_order: "Lumpia",
      quantity: 2,
      price_at_order: 40.0,
      image_at_order: "1.png",
      itemId: "2",
      orderId: "1",
    });

    expect(result.id).toBe("3");
  });
});
