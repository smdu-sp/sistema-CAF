-- AlterTable
ALTER TABLE `reservas` ADD COLUMN `status` ENUM('SOLICITADO', 'APROVADO', 'CANCELADO') NOT NULL DEFAULT 'SOLICITADO',
    ADD COLUMN `motivoCancelamento` TEXT NULL;

-- Reservas já existentes no sistema: consideradas aprovadas
UPDATE `reservas` SET `status` = 'APROVADO';

CREATE INDEX `reservas_status_idx` ON `reservas`(`status`);
