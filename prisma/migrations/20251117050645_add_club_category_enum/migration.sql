/*
  Warnings:

  - You are about to alter the column `category` on the `Club` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Club` MODIFY `category` ENUM('TECH', 'NON_TECH', 'EXTRACURRICULAR') NOT NULL;
