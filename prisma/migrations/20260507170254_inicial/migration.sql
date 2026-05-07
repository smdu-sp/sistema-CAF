-- CreateTable
CREATE TABLE `avaliacao_limpeza.categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacao_limpeza.categorias_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao_limpeza.criterios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoriaAvaliacaoId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao_limpeza.salas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao_limpeza.avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mes` INTEGER NOT NULL,
    `ano` INTEGER NOT NULL,
    `salaId` INTEGER NOT NULL,
    `avaliadoPor` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacao_limpeza.avaliacoes_mes_ano_salaId_key`(`mes`, `ano`, `salaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao_limpeza.avaliacoes_criterios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criterioAvaliacaoId` INTEGER NOT NULL,
    `avaliacaoId` INTEGER NOT NULL,
    `nota` ENUM('RUIM', 'REGULAR', 'BOM', 'OTIMO') NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacao_limpeza.avaliacoes_criterios_criterioAvaliacaoId_a_key`(`criterioAvaliacaoId`, `avaliacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao_limpeza.arquivos_avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avaliacaoCriterioId` INTEGER NOT NULL,
    `avaliacaoId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_sala.salas` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `andar` VARCHAR(60) NULL,
    `numero` VARCHAR(10) NULL,
    `lotacao` INTEGER NULL,
    `layout` ENUM('MOVEL', 'FIXO') NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_sala.sala_layout_fotos` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(120) NOT NULL,
    `imagemUrl` VARCHAR(512) NOT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reserva_sala.sala_layout_fotos_salaId_idx`(`salaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_sala.sala_mobiliarios` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_sala.sala_midias` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_sala.reservas` (
    `id` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,
    `usuarioLogin` VARCHAR(60) NOT NULL,
    `usuarioNome` VARCHAR(255) NULL,
    `coordenadoriaId` VARCHAR(191) NULL,
    `inicio` DATETIME(3) NOT NULL,
    `fim` DATETIME(3) NOT NULL,
    `titulo` VARCHAR(255) NULL,
    `telefoneRamal` VARCHAR(80) NULL,
    `emailContato` VARCHAR(255) NULL,
    `numeroParticipantes` INTEGER NULL,
    `status` ENUM('SOLICITADO', 'APROVADO', 'CANCELADO') NOT NULL DEFAULT 'SOLICITADO',
    `motivoCancelamento` TEXT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `layoutEscolhidoDescricao` VARCHAR(120) NULL,
    `salaLayoutFotoId` VARCHAR(191) NULL,

    INDEX `reserva_sala.reservas_salaLayoutFotoId_idx`(`salaLayoutFotoId`),
    INDEX `reserva_sala.reservas_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_sala.reserva_participantes` (
    `id` VARCHAR(191) NOT NULL,
    `reservaId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reserva_sala.reserva_participantes_reservaId_usuarioId_key`(`reservaId`, `usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `principal.coordenadorias` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `principal.usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `nomeSocial` VARCHAR(191) NULL,
    `login` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `permissao` ENUM('DEV', 'ADM', 'TEC', 'USR') NOT NULL DEFAULT 'USR',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `avatar` TEXT NULL,
    `coordenadoriaId` VARCHAR(191) NULL,
    `ultimoLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `principal.usuarios_login_key`(`login`),
    UNIQUE INDEX `principal.usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.criterios` ADD CONSTRAINT `avaliacao_limpeza.criterios_categoriaAvaliacaoId_fkey` FOREIGN KEY (`categoriaAvaliacaoId`) REFERENCES `avaliacao_limpeza.categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.avaliacoes` ADD CONSTRAINT `avaliacao_limpeza.avaliacoes_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `avaliacao_limpeza.salas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.avaliacoes` ADD CONSTRAINT `avaliacao_limpeza.avaliacoes_avaliadoPor_fkey` FOREIGN KEY (`avaliadoPor`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.avaliacoes_criterios` ADD CONSTRAINT `avaliacao_limpeza.avaliacoes_criterios_criterioAvaliacaoId_fkey` FOREIGN KEY (`criterioAvaliacaoId`) REFERENCES `avaliacao_limpeza.criterios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.avaliacoes_criterios` ADD CONSTRAINT `avaliacao_limpeza.avaliacoes_criterios_avaliacaoId_fkey` FOREIGN KEY (`avaliacaoId`) REFERENCES `avaliacao_limpeza.avaliacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.arquivos_avaliacao` ADD CONSTRAINT `avaliacao_limpeza.arquivos_avaliacao_avaliacaoCriterioId_fkey` FOREIGN KEY (`avaliacaoCriterioId`) REFERENCES `avaliacao_limpeza.avaliacoes_criterios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao_limpeza.arquivos_avaliacao` ADD CONSTRAINT `avaliacao_limpeza.arquivos_avaliacao_avaliacaoId_fkey` FOREIGN KEY (`avaliacaoId`) REFERENCES `avaliacao_limpeza.avaliacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.sala_layout_fotos` ADD CONSTRAINT `reserva_sala.sala_layout_fotos_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `reserva_sala.salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.sala_mobiliarios` ADD CONSTRAINT `reserva_sala.sala_mobiliarios_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `reserva_sala.salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.sala_midias` ADD CONSTRAINT `reserva_sala.sala_midias_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `reserva_sala.salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.reservas` ADD CONSTRAINT `reserva_sala.reservas_salaLayoutFotoId_fkey` FOREIGN KEY (`salaLayoutFotoId`) REFERENCES `reserva_sala.sala_layout_fotos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.reservas` ADD CONSTRAINT `reserva_sala.reservas_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `reserva_sala.salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.reservas` ADD CONSTRAINT `reserva_sala.reservas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.reservas` ADD CONSTRAINT `reserva_sala.reservas_coordenadoriaId_fkey` FOREIGN KEY (`coordenadoriaId`) REFERENCES `principal.coordenadorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.reserva_participantes` ADD CONSTRAINT `reserva_sala.reserva_participantes_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `reserva_sala.reservas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_sala.reserva_participantes` ADD CONSTRAINT `reserva_sala.reserva_participantes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `principal.usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `principal.usuarios` ADD CONSTRAINT `principal.usuarios_coordenadoriaId_fkey` FOREIGN KEY (`coordenadoriaId`) REFERENCES `principal.coordenadorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
