/*
  Warnings:

  - The primary key for the `salas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `andar` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `lotacao` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `salas` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `salas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `coordenadorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reserva_participantes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reserva_participantes` DROP FOREIGN KEY `reserva_participantes_reservaId_fkey`;

-- DropForeignKey
ALTER TABLE `reserva_participantes` DROP FOREIGN KEY `reserva_participantes_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `reservas` DROP FOREIGN KEY `reservas_coordenadoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `reservas` DROP FOREIGN KEY `reservas_salaId_fkey`;

-- DropForeignKey
ALTER TABLE `reservas` DROP FOREIGN KEY `reservas_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `usuarios_coordenadoriaId_fkey`;

-- AlterTable
ALTER TABLE `salas` DROP PRIMARY KEY,
    DROP COLUMN `andar`,
    DROP COLUMN `ativo`,
    DROP COLUMN `layout`,
    DROP COLUMN `lotacao`,
    DROP COLUMN `numero`,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nome` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `coordenadorias`;

-- DropTable
DROP TABLE `reserva_participantes`;

-- DropTable
DROP TABLE `reservas`;

-- DropTable
DROP TABLE `usuarios`;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categorias_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `criterios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoriaAvaliacaoId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mes` INTEGER NOT NULL,
    `ano` INTEGER NOT NULL,
    `salaId` INTEGER NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacoes_mes_ano_salaId_key`(`mes`, `ano`, `salaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes_criterios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `criterioAvaliacaoId` INTEGER NOT NULL,
    `avaliacaoId` INTEGER NOT NULL,
    `nota` ENUM('RUIM', 'REGULAR', 'BOM', 'OTIMO') NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `avaliacoes_criterios_criterioAvaliacaoId_avaliacaoId_key`(`criterioAvaliacaoId`, `avaliacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `arquivos_avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avaliacaoCriterioId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `criterios` ADD CONSTRAINT `criterios_categoriaAvaliacaoId_fkey` FOREIGN KEY (`categoriaAvaliacaoId`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `salas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_criterios` ADD CONSTRAINT `avaliacoes_criterios_criterioAvaliacaoId_fkey` FOREIGN KEY (`criterioAvaliacaoId`) REFERENCES `criterios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes_criterios` ADD CONSTRAINT `avaliacoes_criterios_avaliacaoId_fkey` FOREIGN KEY (`avaliacaoId`) REFERENCES `avaliacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `arquivos_avaliacao` ADD CONSTRAINT `arquivos_avaliacao_avaliacaoCriterioId_fkey` FOREIGN KEY (`avaliacaoCriterioId`) REFERENCES `avaliacoes_criterios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
