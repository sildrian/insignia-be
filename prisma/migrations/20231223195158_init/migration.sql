/*
  Warnings:

  - You are about to drop the column `to_user_id` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "to_user_id",
ADD COLUMN     "involved_user_id" INTEGER;
