-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "balance" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance_history" (
    "id" SERIAL NOT NULL,
    "blc_amount" BIGINT NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "type" TEXT,
    "from_user_id" INTEGER,

    CONSTRAINT "balance_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "trx_amount" BIGINT NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'transfer',
    "source_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
