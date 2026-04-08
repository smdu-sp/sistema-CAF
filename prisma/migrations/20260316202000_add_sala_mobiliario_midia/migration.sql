-- CreateTable
CREATE TABLE `sala_mobiliarios` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sala_midias` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sala_mobiliarios` ADD CONSTRAINT `sala_mobiliarios_salaId_fkey`
FOREIGN KEY (`salaId`) REFERENCES `salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sala_midias` ADD CONSTRAINT `sala_midias_salaId_fkey`
FOREIGN KEY (`salaId`) REFERENCES `salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
