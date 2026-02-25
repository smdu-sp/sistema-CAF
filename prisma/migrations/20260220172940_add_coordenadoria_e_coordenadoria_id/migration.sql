-- AlterTable
ALTER TABLE `reservas` ADD COLUMN `coordenadoriaId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `coordenadoriaId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `coordenadorias` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_coordenadoriaId_fkey` FOREIGN KEY (`coordenadoriaId`) REFERENCES `coordenadorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_coordenadoriaId_fkey` FOREIGN KEY (`coordenadoriaId`) REFERENCES `coordenadorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
