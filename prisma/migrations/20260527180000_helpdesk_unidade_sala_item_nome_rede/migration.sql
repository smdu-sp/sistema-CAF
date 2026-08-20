-- Sala da unidade (cadastro) e nome de rede do computador (patrimônio)
ALTER TABLE `hd.unidades` ADD COLUMN `sala` VARCHAR(120) NULL;

ALTER TABLE `hd.itens_patrimonio` ADD COLUMN `nomeRede` VARCHAR(120) NULL;
