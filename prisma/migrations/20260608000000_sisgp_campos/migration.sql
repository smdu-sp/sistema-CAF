-- HdItemPatrimonio: campos adicionados para compatibilidade com SISGP
-- Aplicado via prisma db push antes desta migração ser criada.

ALTER TABLE `hd.itens_patrimonio`
  MODIFY COLUMN `patrimonio` VARCHAR(50) NULL,
  MODIFY COLUMN `tipo` VARCHAR(240) NULL,
  MODIFY COLUMN `descsbpm` VARCHAR(300) NULL,
  MODIFY COLUMN `numserie` VARCHAR(240) NULL,
  MODIFY COLUMN `modelo` VARCHAR(240) NULL,
  MODIFY COLUMN `cimbpm` VARCHAR(240) NULL,
  MODIFY COLUMN `nomeRede` VARCHAR(240) NULL,
  ADD COLUMN IF NOT EXISTS `tiposbpm` VARCHAR(240) NULL,
  ADD COLUMN IF NOT EXISTS `localizacao` VARCHAR(240) NULL,
  ADD COLUMN IF NOT EXISTS `numprocesso` VARCHAR(300) NULL,
  ADD COLUMN IF NOT EXISTS `excluido` TINYINT(1) NOT NULL DEFAULT 0;
