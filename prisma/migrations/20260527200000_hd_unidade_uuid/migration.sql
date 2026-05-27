-- HdUnidade: PK INT -> UUID (VARCHAR 36)
-- Filhos já em VARCHAR(36) quando migração parcial foi aplicada antes.

SET FOREIGN_KEY_CHECKS = 0;

UPDATE `hd.unidades` SET `id_uuid` = UUID() WHERE `id_uuid` IS NULL OR `id_uuid` = '';

ALTER TABLE `hd.unidades` MODIFY `id` INT NOT NULL;
ALTER TABLE `hd.unidades` DROP PRIMARY KEY;
ALTER TABLE `hd.unidades` DROP COLUMN `id`;
ALTER TABLE `hd.unidades` CHANGE COLUMN `id_uuid` `id` VARCHAR(36) NOT NULL;
ALTER TABLE `hd.unidades` ADD PRIMARY KEY (`id`);

ALTER TABLE `hd.chamados`
  ADD CONSTRAINT `hd.chamados_unidadeId_fkey`
  FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `hd.itens_patrimonio`
  ADD CONSTRAINT `hd.itens_patrimonio_unidadeId_fkey`
  FOREIGN KEY (`unidadeId`) REFERENCES `hd.unidades`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `hd.transferencias_cabecalho`
  ADD CONSTRAINT `hd.transferencias_cabecalho_idUnidadeDestino_fkey`
  FOREIGN KEY (`idUnidadeDestino`) REFERENCES `hd.unidades`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
