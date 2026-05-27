-- AlterTable
ALTER TABLE `hd.mensagens` MODIFY `tipo` ENUM('publica', 'interna', 'solucao') NOT NULL DEFAULT 'publica';
