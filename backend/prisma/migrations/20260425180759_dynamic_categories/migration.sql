-- Step 1: Add categoryId as nullable (before dropping the enum)
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

-- Step 2: Backfill from existing enum column
UPDATE "Product" SET "categoryId" = 'clcat_anime'      WHERE "category" = 'ANIME';
UPDATE "Product" SET "categoryId" = 'clcat_animals'    WHERE "category" = 'ANIMALS';
UPDATE "Product" SET "categoryId" = 'clcat_characters' WHERE "category" = 'CHARACTERS';
UPDATE "Product" SET "categoryId" = 'clcat_others'     WHERE "category" = 'OTHERS';

-- Step 3: Drop old indexes and column so we can drop the enum
DROP INDEX "Product_available_category_idx";
DROP INDEX "Product_category_idx";
ALTER TABLE "Product" DROP COLUMN "category";

-- Step 4: Drop the enum (now nothing references it)
DROP TYPE "Category";

-- Step 5: Create Category table (safe now, no name conflict)
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Step 6: Insert default categories with deterministic IDs
INSERT INTO "Category" ("id", "name") VALUES
    ('clcat_anime',      'Anime'),
    ('clcat_animals',    'Animales'),
    ('clcat_characters', 'Personajes'),
    ('clcat_others',     'Otros');

-- Step 7: Make categoryId NOT NULL and add FK
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 8: New indexes
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_available_categoryId_idx" ON "Product"("available", "categoryId");
