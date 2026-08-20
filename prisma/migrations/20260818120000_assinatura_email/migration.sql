-- Assinatura de e-mail institucional

ALTER TABLE `principal.permissoes` MODIFY `modulo` ENUM('reserva_salas', 'avaliacao_limpeza', 'gestao_pessoas', 'teletrabalho', 'assinatura_email') NOT NULL;

-- CreateTable
CREATE TABLE `assinatura.setores` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(250) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assinatura.setores_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assinatura.cargos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assinatura.cargos_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assinatura.gruporamais` (
    `id` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(30) NOT NULL,
    `ramalGrupo` VARCHAR(30) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assinatura.gruporamais_usuario_key`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assinatura.perfis` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `nomeExibicao` VARCHAR(120) NULL,
    `cargo` VARCHAR(150) NULL,
    `setorId` VARCHAR(191) NULL,
    `andar` VARCHAR(10) NULL,
    `aniversario` VARCHAR(10) NULL,
    `ramal` VARCHAR(30) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assinatura.perfis_usuarioId_key`(`usuarioId`),
    INDEX `assinatura.perfis_setorId_idx`(`setorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assinatura.perfis` ADD CONSTRAINT `assinatura.perfis_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assinatura.perfis` ADD CONSTRAINT `assinatura.perfis_setorId_fkey` FOREIGN KEY (`setorId`) REFERENCES `assinatura.setores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
