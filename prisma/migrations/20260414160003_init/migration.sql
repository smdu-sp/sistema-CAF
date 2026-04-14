/*
  Warnings:

  - You are about to drop the column `salaReservaId` on the `reserva_sala.reservas` table. All the data in the column will be lost.
  - Added the required column `salaId` to the `reserva_sala.reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reserva_sala.reservas` DROP FOREIGN KEY `reserva_sala.reservas_salaReservaId_fkey`;

-- DropIndex
DROP INDEX `reserva_sala.reservas_salaReservaId_fkey` ON `reserva_sala.reservas`;

-- AlterTable
ALTER TABLE `reserva_sala.reservas` DROP COLUMN `salaReservaId`,
    ADD COLUMN `salaId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `reserva_sala.reservas` ADD CONSTRAINT `reserva_sala.reservas_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `reserva_sala.salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
