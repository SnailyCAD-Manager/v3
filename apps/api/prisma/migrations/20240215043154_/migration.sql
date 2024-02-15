/*
  Warnings:

  - Made the column `path` on table `StorageInstance` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StorageInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "settings" TEXT NOT NULL
);
INSERT INTO "new_StorageInstance" ("id", "name", "path", "settings") SELECT "id", "name", "path", "settings" FROM "StorageInstance";
DROP TABLE "StorageInstance";
ALTER TABLE "new_StorageInstance" RENAME TO "StorageInstance";
CREATE UNIQUE INDEX "StorageInstance_id_key" ON "StorageInstance"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
