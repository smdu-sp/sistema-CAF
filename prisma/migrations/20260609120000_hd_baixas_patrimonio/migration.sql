-- CreateTable
CREATE TABLE `hd.baixas_patrimonio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idItem` INTEGER NOT NULL,
    `dataBaixa` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idUsuarioBaixa` VARCHAR(191) NOT NULL,
    `documentoSbpm` VARCHAR(200) NOT NULL,
    `observacao` TEXT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hd.baixas_patrimonio` ADD CONSTRAINT `hd.baixas_patrimonio_idItem_fkey` FOREIGN KEY (`idItem`) REFERENCES `hd.itens_patrimonio`(`idbem`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.baixas_patrimonio` ADD CONSTRAINT `hd.baixas_patrimonio_idUsuarioBaixa_fkey` FOREIGN KEY (`idUsuarioBaixa`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
