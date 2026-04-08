-- AlterTable
ALTER TABLE `reservas` ADD COLUMN `emailContato` VARCHAR(255) NULL,
    ADD COLUMN `numeroParticipantes` INTEGER NULL,
    ADD COLUMN `telefoneRamal` VARCHAR(80) NULL;
