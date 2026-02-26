/*
  Warnings:

  - A unique constraint covering the columns `[itemId,orderId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_items_itemId_orderId_key" ON "order_items"("itemId", "orderId");
