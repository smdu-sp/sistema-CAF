-- CreateTable
CREATE TABLE `inv.equipamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NULL,
    `tipo` ENUM('desktop', 'notebook', 'servidor', 'switch', 'roteador', 'impressora', 'storage', 'outro') NOT NULL DEFAULT 'outro',
    `hostname` VARCHAR(200) NULL,
    `nome` VARCHAR(200) NULL,
    `ip` VARCHAR(45) NULL,
    `mac` VARCHAR(20) NULL,
    `fabricante` VARCHAR(150) NULL,
    `modelo` VARCHAR(200) NULL,
    `numserie` VARCHAR(200) NULL,
    `so` VARCHAR(150) NULL,
    `soVersao` VARCHAR(80) NULL,
    `soBuild` VARCHAR(80) NULL,
    `usuarioLogado` VARCHAR(150) NULL,
    `dominio` VARCHAR(150) NULL,
    `statusRede` ENUM('online', 'offline', 'nunca_visto') NOT NULL DEFAULT 'nunca_visto',
    `ultimoContato` DATETIME(3) NULL,
    `ultimaColeta` DATETIME(3) NULL,
    `metodoColeta` ENUM('winrm', 'snmp', 'ssh', 'manual', 'import', 'ping') NULL,
    `unidadeId` VARCHAR(191) NULL,
    `servidorId` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `inv.equipamentos_itemId_key`(`itemId`),
    INDEX `inv.equipamentos_statusRede_idx`(`statusRede`),
    INDEX `inv.equipamentos_ip_idx`(`ip`),
    INDEX `inv.equipamentos_mac_idx`(`mac`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.hardware` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamentoId` INTEGER NOT NULL,
    `cpuModelo` VARCHAR(200) NULL,
    `cpuNucleos` INTEGER NULL,
    `ramTotalMb` INTEGER NULL,
    `placaMae` VARCHAR(200) NULL,
    `bios` VARCHAR(200) NULL,
    `placaVideo` VARCHAR(200) NULL,

    UNIQUE INDEX `inv.hardware_equipamentoId_key`(`equipamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.discos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamentoId` INTEGER NOT NULL,
    `modelo` VARCHAR(200) NULL,
    `tamanhoMb` INTEGER NULL,
    `livreMb` INTEGER NULL,

    INDEX `inv.discos_equipamentoId_idx`(`equipamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.softwares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamentoId` INTEGER NOT NULL,
    `nome` VARCHAR(300) NOT NULL,
    `fabricante` VARCHAR(200) NULL,
    `versao` VARCHAR(80) NULL,
    `dataInstalacao` DATETIME(3) NULL,
    `caminho` VARCHAR(500) NULL,
    `proibido` BOOLEAN NOT NULL DEFAULT false,

    INDEX `inv.softwares_equipamentoId_idx`(`equipamentoId`),
    INDEX `inv.softwares_nome_idx`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.historico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamentoId` INTEGER NOT NULL,
    `campo` VARCHAR(80) NOT NULL,
    `valorAnterior` TEXT NULL,
    `valorNovo` TEXT NULL,
    `origem` ENUM('winrm', 'snmp', 'ssh', 'manual', 'import', 'ping') NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inv.historico_equipamentoId_criadoEm_idx`(`equipamentoId`, `criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.localizacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamentoId` INTEGER NOT NULL,
    `predio` VARCHAR(150) NULL,
    `andar` VARCHAR(80) NULL,
    `sala` VARCHAR(120) NULL,
    `mesa` VARCHAR(80) NULL,
    `atual` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inv.localizacoes_equipamentoId_idx`(`equipamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.alertas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipamentoId` INTEGER NOT NULL,
    `tipo` VARCHAR(80) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `resolvido` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inv.alertas_equipamentoId_resolvido_idx`(`equipamentoId`, `resolvido`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inv.subredes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cidr` VARCHAR(50) NOT NULL,
    `descricao` VARCHAR(200) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `ultimoScan` DATETIME(3) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inv.equipamentos` ADD CONSTRAINT `inv.equipamentos_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `hd.itens_patrimonio`(`idbem`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.equipamentos` ADD CONSTRAINT `inv.equipamentos_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.equipamentos` ADD CONSTRAINT `inv.equipamentos_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.hardware` ADD CONSTRAINT `inv.hardware_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `inv.equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.discos` ADD CONSTRAINT `inv.discos_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `inv.equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.softwares` ADD CONSTRAINT `inv.softwares_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `inv.equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.historico` ADD CONSTRAINT `inv.historico_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `inv.equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.localizacoes` ADD CONSTRAINT `inv.localizacoes_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `inv.equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inv.alertas` ADD CONSTRAINT `inv.alertas_equipamentoId_fkey` FOREIGN KEY (`equipamentoId`) REFERENCES `inv.equipamentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
