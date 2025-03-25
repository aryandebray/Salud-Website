/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "imageUrl",
DROP COLUMN "isAvailable",
DROP COLUMN "menuId",
DROP COLUMN "price";
