-- AlterEnum: adiciona encaminhamento ao tipo de evento
ALTER TABLE `hd.chamado_eventos` MODIFY `tipo` ENUM('abertura', 'atribuicao', 'resolucao', 'fechamento', 'reabertura', 'statusAlterado', 'encaminhamento') NOT NULL;

-- AlterTable: áreas de atendimento no chamado
ALTER TABLE `hd.chamados`
  ADD COLUMN `areaOrigem` ENUM('suporte_tecnico', 'telefonia_voip', 'acesso_sistemas', 'rede_conectividade', 'reparos_infraestrutura') NOT NULL DEFAULT 'suporte_tecnico',
  ADD COLUMN `areaAtual` ENUM('suporte_tecnico', 'telefonia_voip', 'acesso_sistemas', 'rede_conectividade', 'reparos_infraestrutura') NOT NULL DEFAULT 'suporte_tecnico';

CREATE INDEX `hd.chamados_areaAtual_idx` ON `hd.chamados`(`areaAtual`);

-- CreateTable: histórico de encaminhamentos
CREATE TABLE `hd.chamado_encaminhamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chamadoId` INTEGER NOT NULL,
    `areaDe` ENUM('suporte_tecnico', 'telefonia_voip', 'acesso_sistemas', 'rede_conectividade', 'reparos_infraestrutura') NOT NULL,
    `areaPara` ENUM('suporte_tecnico', 'telefonia_voip', 'acesso_sistemas', 'rede_conectividade', 'reparos_infraestrutura') NOT NULL,
    `motivo` TEXT NOT NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `hd.chamado_encaminhamentos` ADD CONSTRAINT `hd.chamado_encaminhamentos_chamadoId_fkey` FOREIGN KEY (`chamadoId`) REFERENCES `hd.chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `hd.chamado_encaminhamentos` ADD CONSTRAINT `hd.chamado_encaminhamentos_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
