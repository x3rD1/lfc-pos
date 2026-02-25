const prisma = require("../../../../lib/prisma");
const itemService = require("../item.service");

jest.mock("../../../../lib/prisma", () => ({
  item: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("Item Service", () => {
  it("throws an error if price is negative", async () => {
    await expect(
      itemService.createItem({
        name: "Test",
        price: -50,
        image: "test.png",
        ownerId: "user1",
      }),
    ).rejects.toThrow("PRICE_CANNOT_BE_NEGATIVE");
  });

  it("creates an item with valid price", async () => {
    prisma.item.create.mockResolvedValue({
      id: "test123",
      name: "Lumpia",
      price: 6.0,
      image: "1.png",
      ownerId: "user1",
    });

    const result = await itemService.createItem({
      name: "Lumpia",
      price: 6.0,
      image: "1.png",
      ownerId: "user1",
    });

    expect(prisma.item.create).toHaveBeenCalledWith({
      data: {
        name: "Lumpia",
        price: 6.0,
        image: "1.png",
        ownerId: "user1",
      },
    });

    expect(result.name).toBe("Lumpia");
    expect(result.price).toBe(6.0);
  });

  it("updates an item with valid price", async () => {
    prisma.item.update.mockResolvedValue({
      id: "test234",
      name: "Shanghai",
      price: 10.0,
      image: "1.png",
      ownerId: "user1",
    });

    const updated = await itemService.updateItem({
      itemId: "test234",
      name: "Shanghai",
      price: 10.0,
      image: "1.png",
      ownerId: "user1",
    });

    expect(prisma.item.update).toHaveBeenCalledWith({
      where: { id_ownerId: { id: "test234", ownerId: "user1" } },
      data: { name: "Shanghai", price: 10.0, image: "1.png" },
    });
    expect(updated.name).toBe("Shanghai");
    expect(updated.price).toBe(10.0);
  });

  it("deletes an item", async () => {
    prisma.item.delete.mockResolvedValue({
      id: "delete123",
      ownerId: "user1",
    });

    const result = await itemService.deleteItem({
      itemId: "delete123",
      ownerId: "user1",
    });

    expect(prisma.item.delete).toHaveBeenCalledWith({
      where: { id_ownerId: { id: "delete123", ownerId: "user1" } },
    });

    expect(result.id).toBe("delete123");
  });

  it("Get all items", async () => {
    prisma.item.findMany.mockResolvedValue([
      {
        id: "1",
        name: "Lumpia",
        price: 20.0,
        image: "1.png",
        ownerId: "user1",
      },
      {
        id: "2",
        name: "Siomai",
        price: 10.0,
        image: "2.png",
        ownerId: "user1",
      },
    ]);

    const result = await itemService.getAllItems("user1");

    expect(prisma.item.findMany).toHaveBeenCalledWith({
      where: { ownerId: "user1" },
    });

    expect(result.length).toBe(2);
  });
});
