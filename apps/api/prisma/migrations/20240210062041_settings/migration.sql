/*
  Warnings:

  - You are about to drop the `AutoRestart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AutoUpdate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrashDetection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnStartup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `settingsId` on the `StorageInstance` table. All the data in the column will be lost.
  - Added the required column `settings` to the `StorageInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AutoRestart_id_key";

-- DropIndex
DROP INDEX "AutoUpdate_id_key";

-- DropIndex
DROP INDEX "CrashDetection_id_key";

-- DropIndex
DROP INDEX "OnStartup_id_key";

-- DropIndex
DROP INDEX "Settings_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AutoRestart";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AutoUpdate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CrashDetection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OnStartup";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Settings";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StorageInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "settings" TEXT NOT NULL
);
INSERT INTO "new_StorageInstance" ("id", "name") SELECT "id", "name" FROM "StorageInstance";
DROP TABLE "StorageInstance";
ALTER TABLE "new_StorageInstance" RENAME TO "StorageInstance";
CREATE UNIQUE INDEX "StorageInstance_id_key" ON "StorageInstance"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
