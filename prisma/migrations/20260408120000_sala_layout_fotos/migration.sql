-- CreateTable
CREATE TABLE `sala_layout_fotos` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(120) NOT NULL,
    `imagemUrl` VARCHAR(512) NOT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sala_layout_fotos_salaId_idx`(`salaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sala_layout_fotos` ADD CONSTRAINT `sala_layout_fotos_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate legacy single image per room
INSERT INTO `sala_layout_fotos` (`id`, `salaId`, `descricao`, `imagemUrl`, `ordem`, `criadoEm`, `atualizadoEm`)
SELECT UUID(), `id`, 'Layout', `layoutImagemUrl`, 0, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM `salas`
WHERE `layoutImagemUrl` IS NOT NULL AND `layoutImagemUrl` <> '';

-- AlterTable
ALTER TABLE `salas` DROP COLUMN `layoutImagemUrl`;
