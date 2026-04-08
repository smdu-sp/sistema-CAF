-- AlterTable
ALTER TABLE `salas`
    ADD COLUMN `numero` VARCHAR(10) NULL,
    ADD COLUMN `lotacao` INTEGER NULL,
    ADD COLUMN `layout` VARCHAR(255) NULL;

-- Migra dados antigos, quando existirem
UPDATE `salas` SET `lotacao` = `capacidade` WHERE `lotacao` IS NULL;
UPDATE `salas` SET `numero` = `localizacao` WHERE `numero` IS NULL;

-- Remove colunas antigas
ALTER TABLE `salas`
    DROP COLUMN `descricao`,
    DROP COLUMN `capacidade`,
    DROP COLUMN `localizacao`;
