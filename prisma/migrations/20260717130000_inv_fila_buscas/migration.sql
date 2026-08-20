-- CreateTable
CREATE TABLE `inv.coleta_solicitacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alvo` VARCHAR(200) NOT NULL,
    `tipoAlvo` VARCHAR(20) NOT NULL DEFAULT 'host',
    `status` ENUM('pendente', 'processando', 'concluida', 'erro') NOT NULL DEFAULT 'pendente',
    `solicitadoPor` VARCHAR(191) NULL,
    `resultado` TEXT NULL,
    `processadoEm` DATETIME(3) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inv.coleta_solicitacoes_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inv.coleta_solicitacoes` ADD CONSTRAINT `inv.coleta_solicitacoes_solicitadoPor_fkey` FOREIGN KEY (`solicitadoPor`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
