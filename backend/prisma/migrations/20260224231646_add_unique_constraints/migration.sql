/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,ownerId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "items_id_ownerId_key" ON "items"("id", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_ownerId_key" ON "orders"("id", "ownerId");
