/*
  Warnings:

  - The values [reserva_sala] on the enum `principal.permissoes_modulo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `principal.permissoes` ADD COLUMN `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `modulo` ENUM('reserva_salas', 'avaliacao_limpeza') NOT NULL;
