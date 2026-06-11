-- AlterEnum: status aguardando_autorizacao
ALTER TABLE `hd.chamados` MODIFY `status` ENUM('aberto', 'atendimento', 'aguardando', 'aguardando_autorizacao', 'prodam', 'resolvido', 'fechado') NOT NULL DEFAULT 'aberto';

-- CreateTable: sistemas de acesso
CREATE TABLE `hd.sistemas_acesso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` ENUM('sisacoe', 'sei', 'aprova_digital', 'slce', 'portal_licenciamento', 'simproc') NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `hd.sistemas_acesso_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: permissões por sistema
CREATE TABLE `hd.sistemas_permissoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sistemaId` INTEGER NOT NULL,
    `nome` VARCHAR(200) NOT NULL,
    `descricao` VARCHAR(500) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `hd.sistemas_permissoes_sistemaId_nome_key`(`sistemaId`, `nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: pontos focais
CREATE TABLE `hd.pontos_focais_unidade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidadeId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `hd.pontos_focais_unidade_unidadeId_usuarioId_key`(`unidadeId`, `usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: solicitações de acesso
CREATE TABLE `hd.solicitacoes_acesso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chamadoId` INTEGER NOT NULL,
    `nomeBeneficiario` VARCHAR(250) NOT NULL,
    `rfBeneficiario` VARCHAR(20) NOT NULL,
    `sistemaId` INTEGER NOT NULL,
    `permissaoId` INTEGER NOT NULL,
    `unidadeId` VARCHAR(191) NOT NULL,
    `coordenadoriaId` VARCHAR(191) NULL,
    `observacao` TEXT NULL,
    `paraSiMesmo` BOOLEAN NOT NULL DEFAULT true,
    `beneficiarioUsuarioId` VARCHAR(191) NULL,
    `statusAutorizacao` ENUM('aguardando', 'negado', 'autorizado') NOT NULL DEFAULT 'aguardando',
    `responsavelAutorizacaoId` VARCHAR(191) NULL,
    `responsavelAutorizacaoNome` VARCHAR(250) NULL,
    `responsavelAutorizacaoEmail` VARCHAR(250) NULL,
    `negadoPorId` VARCHAR(191) NULL,
    `motivoNegacao` TEXT NULL,
    `dataAutorizacao` DATETIME(3) NULL,
    `emailEnviadoEm` DATETIME(3) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `hd.solicitacoes_acesso_chamadoId_key`(`chamadoId`),
    INDEX `hd.solicitacoes_acesso_statusAutorizacao_idx`(`statusAutorizacao`),
    INDEX `hd.solicitacoes_acesso_unidadeId_idx`(`unidadeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `hd.sistemas_permissoes` ADD CONSTRAINT `hd.sistemas_permissoes_sistemaId_fkey` FOREIGN KEY (`sistemaId`) REFERENCES `hd.sistemas_acesso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `hd.pontos_focais_unidade` ADD CONSTRAINT `hd.pontos_focais_unidade_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `hd.pontos_focais_unidade` ADD CONSTRAINT `hd.pontos_focais_unidade_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_chamadoId_fkey` FOREIGN KEY (`chamadoId`) REFERENCES `hd.chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_sistemaId_fkey` FOREIGN KEY (`sistemaId`) REFERENCES `hd.sistemas_acesso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_permissaoId_fkey` FOREIGN KEY (`permissaoId`) REFERENCES `hd.sistemas_permissoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_coordenadoriaId_fkey` FOREIGN KEY (`coordenadoriaId`) REFERENCES `principal.coordenadorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_beneficiarioUsuarioId_fkey` FOREIGN KEY (`beneficiarioUsuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `hd.solicitacoes_acesso` ADD CONSTRAINT `hd.solicitacoes_acesso_negadoPorId_fkey` FOREIGN KEY (`negadoPorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
