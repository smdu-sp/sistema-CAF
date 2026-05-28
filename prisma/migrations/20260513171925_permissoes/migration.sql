/*
  Warnings:

  - You are about to drop the column `permissao` on the `principal.usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `principal.usuarios` DROP COLUMN `permissao`,
    ADD COLUMN `desenvolvedor` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `principal.permissoes` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(50) NOT NULL,
    `descricao` TEXT NULL,
    `modulo` ENUM('reserva_salas', 'avaliacao_limpeza') NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `principal.usuario_permissoes` (
    `usuarioId` VARCHAR(191) NOT NULL,
    `permissaoId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`usuarioId`, `permissaoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `principal.usuario_permissoes` ADD CONSTRAINT `principal.usuario_permissoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `principal.usuario_permissoes` ADD CONSTRAINT `principal.usuario_permissoes_permissaoId_fkey` FOREIGN KEY (`permissaoId`) REFERENCES `principal.permissoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
