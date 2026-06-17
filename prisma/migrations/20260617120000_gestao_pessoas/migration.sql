-- Gestão de Pessoas: folha de ponto e carga SIGPEG

-- AlterEnum (MySQL: recreate enum on permissoes)
ALTER TABLE `principal.permissoes` MODIFY `modulo` ENUM('reserva_salas', 'avaliacao_limpeza', 'gestao_pessoas') NOT NULL;

-- CreateTable
CREATE TABLE `gp.unidades` (
    `id` VARCHAR(191) NOT NULL,
    `codigoEh` VARCHAR(15) NOT NULL,
    `prefixoEh` VARCHAR(6) NOT NULL,
    `nome` VARCHAR(250) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `gp.unidades_codigoEh_key`(`codigoEh`),
    INDEX `gp.unidades_prefixoEh_idx`(`prefixoEh`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gp.servidores` (
    `id` VARCHAR(191) NOT NULL,
    `rf` VARCHAR(7) NOT NULL,
    `nome` VARCHAR(250) NOT NULL,
    `vinculo` VARCHAR(3) NULL,
    `nomeCargo` VARCHAR(150) NULL,
    `refCargo` VARCHAR(10) NULL,
    `unidadeEh` VARCHAR(15) NULL,
    `nomeUnidade` VARCHAR(250) NULL,
    `ultimaCarga` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `gp.servidores_rf_key`(`rf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gp.cargas_mensais` (
    `id` VARCHAR(191) NOT NULL,
    `mes` INTEGER NOT NULL,
    `ano` INTEGER NOT NULL,
    `totalRegistros` INTEGER NOT NULL DEFAULT 0,
    `importadoPorId` VARCHAR(191) NULL,
    `importadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `gp.cargas_mensais_mes_ano_key`(`mes`, `ano`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gp.servidor_vinculos` (
    `id` VARCHAR(191) NOT NULL,
    `cargaId` VARCHAR(191) NOT NULL,
    `servidorId` VARCHAR(191) NULL,
    `rf` VARCHAR(7) NOT NULL,
    `nome` VARCHAR(250) NOT NULL,
    `vinculo` VARCHAR(3) NULL,
    `especie` VARCHAR(50) NULL,
    `inicio` VARCHAR(10) NULL,
    `termino` VARCHAR(10) NULL,
    `codigoCargo` VARCHAR(10) NULL,
    `nomeCargo` VARCHAR(150) NULL,
    `refCargo` VARCHAR(10) NULL,
    `codigoEh` VARCHAR(15) NOT NULL,
    `nomeUnidade` VARCHAR(250) NOT NULL,
    `relJurAdm` VARCHAR(20) NULL,
    `tipoEvento` VARCHAR(30) NULL,
    `inicioExerc` VARCHAR(10) NULL,
    `titularRf` VARCHAR(10) NULL,
    `numVincTit` VARCHAR(10) NULL,
    `nomeFuncTit` VARCHAR(250) NULL,
    `inicioRem` VARCHAR(10) NULL,
    `fimRem` VARCHAR(10) NULL,
    `observacao` TEXT NULL,
    `vaga` VARCHAR(10) NULL,

    INDEX `gp.servidor_vinculos_cargaId_codigoEh_idx`(`cargaId`, `codigoEh`),
    INDEX `gp.servidor_vinculos_cargaId_rf_idx`(`cargaId`, `rf`),
    INDEX `gp.servidor_vinculos_rf_idx`(`rf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gp.usuario_unidades` (
    `usuarioId` VARCHAR(191) NOT NULL,
    `unidadeId` VARCHAR(191) NOT NULL,
    `papel` ENUM('usuario', 'administrador', 'dgp') NOT NULL DEFAULT 'usuario',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`usuarioId`, `unidadeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gp.cargas_mensais` ADD CONSTRAINT `gp.cargas_mensais_importadoPorId_fkey` FOREIGN KEY (`importadoPorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gp.servidor_vinculos` ADD CONSTRAINT `gp.servidor_vinculos_cargaId_fkey` FOREIGN KEY (`cargaId`) REFERENCES `gp.cargas_mensais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gp.servidor_vinculos` ADD CONSTRAINT `gp.servidor_vinculos_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `gp.servidores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gp.usuario_unidades` ADD CONSTRAINT `gp.usuario_unidades_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gp.usuario_unidades` ADD CONSTRAINT `gp.usuario_unidades_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `gp.unidades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
