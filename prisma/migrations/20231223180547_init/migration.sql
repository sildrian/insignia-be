/*
  Warnings:

  - You are about to drop the column `source_user_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `trx_amount` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `balance_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "source_user_id",
DROP COLUMN "trx_amount",
ADD COLUMN     "amount" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "to_user_id" DROP NOT NULL;

-- DropTable
DROP TABLE "balance_history";
