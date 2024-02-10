-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StorageInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    CONSTRAINT "StorageInstance_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "autoStart" BOOLEAN NOT NULL,
    "onStartupId" TEXT NOT NULL,
    "crashDetectionId" TEXT NOT NULL,
    "autoRestartId" TEXT NOT NULL,
    "autoUpdateId" TEXT NOT NULL,
    CONSTRAINT "Settings_onStartupId_fkey" FOREIGN KEY ("onStartupId") REFERENCES "OnStartup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Settings_crashDetectionId_fkey" FOREIGN KEY ("crashDetectionId") REFERENCES "CrashDetection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Settings_autoRestartId_fkey" FOREIGN KEY ("autoRestartId") REFERENCES "AutoRestart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Settings_autoUpdateId_fkey" FOREIGN KEY ("autoUpdateId") REFERENCES "AutoUpdate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OnStartup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL,
    "webhook" TEXT,
    "message" TEXT
);

-- CreateTable
CREATE TABLE "CrashDetection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL,
    "webhook" TEXT,
    "message" TEXT
);

-- CreateTable
CREATE TABLE "AutoRestart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL,
    "maxRestarts" INTEGER
);

-- CreateTable
CREATE TABLE "AutoUpdate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StorageInstance_id_key" ON "StorageInstance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_id_key" ON "Settings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OnStartup_id_key" ON "OnStartup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CrashDetection_id_key" ON "CrashDetection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AutoRestart_id_key" ON "AutoRestart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AutoUpdate_id_key" ON "AutoUpdate"("id");
