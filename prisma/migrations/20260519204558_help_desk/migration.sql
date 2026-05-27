-- AlterTable
ALTER TABLE `principal.usuarios` ADD COLUMN `telefone` VARCHAR(30) NULL;

-- CreateTable
CREATE TABLE `hd.unidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(20) NOT NULL,
    `nome` VARCHAR(200) NOT NULL,
    `raiz` VARCHAR(100) NOT NULL,
    `sigla` VARCHAR(100) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hd.unidades_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(200) NOT NULL,
    `pai` VARCHAR(100) NOT NULL,
    `filho` VARCHAR(100) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.chamados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(300) NOT NULL,
    `descricao` TEXT NOT NULL,
    `status` ENUM('aberto', 'atendimento', 'aguardando', 'resolvido', 'fechado') NOT NULL DEFAULT 'aberto',
    `prioridade` ENUM('baixa', 'media', 'alta', 'urgente') NOT NULL DEFAULT 'media',
    `solicitanteId` VARCHAR(191) NOT NULL,
    `abertoEmNomeDeId` VARCHAR(191) NULL,
    `telefone` VARCHAR(30) NULL,
    `unidadeId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `itemId` INTEGER NULL,
    `resolucao` TEXT NULL,
    `abertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataResolucao` DATETIME(3) NULL,
    `dataFechamento` DATETIME(3) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.chamado_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chamadoId` INTEGER NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `papel` ENUM('solicitante', 'observador', 'tecnico', 'participante') NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hd.chamado_usuarios_chamadoId_usuarioId_papel_key`(`chamadoId`, `usuarioId`, `papel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.chamado_eventos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chamadoId` INTEGER NOT NULL,
    `tipo` ENUM('abertura', 'atribuicao', 'resolucao', 'fechamento', 'reabertura', 'statusAlterado') NOT NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.mensagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chamadoId` INTEGER NOT NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `tipo` ENUM('publica', 'interna') NOT NULL DEFAULT 'publica',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.anexos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chamadoId` INTEGER NOT NULL,
    `mensagemId` INTEGER NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(255) NOT NULL,
    `urlArquivo` VARCHAR(500) NOT NULL,
    `tipoMime` VARCHAR(100) NOT NULL,
    `tamanho` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.itens_patrimonio` (
    `idbem` INTEGER NOT NULL AUTO_INCREMENT,
    `patrimonio` VARCHAR(50) NOT NULL,
    `tipo` VARCHAR(80) NOT NULL,
    `descsbpm` VARCHAR(300) NOT NULL,
    `numserie` VARCHAR(100) NULL,
    `marca` VARCHAR(100) NULL,
    `modelo` VARCHAR(100) NULL,
    `cimbpm` VARCHAR(50) NULL,
    `statusitem` VARCHAR(50) NOT NULL DEFAULT 'Ativo',
    `unidadeId` INTEGER NULL,
    `servidorId` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hd.itens_patrimonio_patrimonio_key`(`patrimonio`),
    PRIMARY KEY (`idbem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.transferencias_cabecalho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cimbpm` VARCHAR(50) NOT NULL,
    `observacao` TEXT NULL,
    `dataTransferencia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idUsuarioRegistro` VARCHAR(191) NOT NULL,
    `idUnidadeDestino` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hd.transferencias_itens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cabecalhoId` INTEGER NOT NULL,
    `idItem` INTEGER NOT NULL,
    `servidorAnterior` VARCHAR(200) NULL,
    `servidorAtual` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hd.chamados` ADD CONSTRAINT `hd.chamados_solicitanteId_fkey` FOREIGN KEY (`solicitanteId`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamados` ADD CONSTRAINT `hd.chamados_abertoEmNomeDeId_fkey` FOREIGN KEY (`abertoEmNomeDeId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamados` ADD CONSTRAINT `hd.chamados_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamados` ADD CONSTRAINT `hd.chamados_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `hd.categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamados` ADD CONSTRAINT `hd.chamados_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `hd.itens_patrimonio`(`idbem`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamado_usuarios` ADD CONSTRAINT `hd.chamado_usuarios_chamadoId_fkey` FOREIGN KEY (`chamadoId`) REFERENCES `hd.chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamado_usuarios` ADD CONSTRAINT `hd.chamado_usuarios_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamado_eventos` ADD CONSTRAINT `hd.chamado_eventos_chamadoId_fkey` FOREIGN KEY (`chamadoId`) REFERENCES `hd.chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.chamado_eventos` ADD CONSTRAINT `hd.chamado_eventos_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.mensagens` ADD CONSTRAINT `hd.mensagens_chamadoId_fkey` FOREIGN KEY (`chamadoId`) REFERENCES `hd.chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.mensagens` ADD CONSTRAINT `hd.mensagens_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.anexos` ADD CONSTRAINT `hd.anexos_chamadoId_fkey` FOREIGN KEY (`chamadoId`) REFERENCES `hd.chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.anexos` ADD CONSTRAINT `hd.anexos_mensagemId_fkey` FOREIGN KEY (`mensagemId`) REFERENCES `hd.mensagens`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.anexos` ADD CONSTRAINT `hd.anexos_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.itens_patrimonio` ADD CONSTRAINT `hd.itens_patrimonio_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.itens_patrimonio` ADD CONSTRAINT `hd.itens_patrimonio_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.transferencias_cabecalho` ADD CONSTRAINT `hd.transferencias_cabecalho_idUsuarioRegistro_fkey` FOREIGN KEY (`idUsuarioRegistro`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.transferencias_cabecalho` ADD CONSTRAINT `hd.transferencias_cabecalho_idUnidadeDestino_fkey` FOREIGN KEY (`idUnidadeDestino`) REFERENCES `hd.unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.transferencias_itens` ADD CONSTRAINT `hd.transferencias_itens_cabecalhoId_fkey` FOREIGN KEY (`cabecalhoId`) REFERENCES `hd.transferencias_cabecalho`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.transferencias_itens` ADD CONSTRAINT `hd.transferencias_itens_idItem_fkey` FOREIGN KEY (`idItem`) REFERENCES `hd.itens_patrimonio`(`idbem`) ON DELETE RESTRICT ON UPDATE CASCADE;
