-- AlterTable
ALTER TABLE `hd.chamados` MODIFY `status` ENUM('aberto', 'atendimento', 'aguardando', 'prodam', 'resolvido', 'fechado') NOT NULL DEFAULT 'aberto';
