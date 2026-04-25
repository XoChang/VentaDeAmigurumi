-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ANIME', 'ANIMALS', 'CHARACTERS', 'OTHERS');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" "Category" NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "storeName" TEXT NOT NULL DEFAULT 'AmigurumiShop',
    "currencySymbol" TEXT NOT NULL DEFAULT 'S/.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_available_idx" ON "Product"("available");

-- CreateIndex
CREATE INDEX "Product_available_category_idx" ON "Product"("available", "category");
