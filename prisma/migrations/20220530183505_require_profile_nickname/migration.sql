/*
 Warnings:
 
 - Made the column `nickname` on table `Profile` required. This step will fail if there are existing NULL values in that column.
 
 */
-- RedefineTables
PRAGMA foreign_keys = OFF;

CREATE TABLE "new_Profile" (
  "nickname" TEXT NOT NULL,
  "theme" TEXT NOT NULL DEFAULT 'system',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
  "new_Profile" (
    "nickname",
    "theme",
    "createdAt",
    "updatedAt",
    "userId"
  )
SELECT
  IFNULL("nickname", hex(randomblob(16))),
  "theme",
  "createdAt",
  "updatedAt",
  "userId"
FROM
  "Profile";

DROP TABLE "Profile";

ALTER TABLE
  "new_Profile" RENAME TO "Profile";

CREATE UNIQUE INDEX "Profile_nickname_key" ON "Profile"("nickname");

CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

PRAGMA foreign_key_check;

PRAGMA foreign_keys = ON;