-- CreateTable
CREATE TABLE `hd.itens_patrimonio_status_historico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idItem` INTEGER NOT NULL,
    `statusAnterior` VARCHAR(50) NULL,
    `statusNovo` VARCHAR(50) NOT NULL,
    `motivo` TEXT NOT NULL,
    `idUsuario` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hd.itens_patrimonio_status_historico` ADD CONSTRAINT `hd.itens_patrimonio_status_historico_idItem_fkey` FOREIGN KEY (`idItem`) REFERENCES `hd.itens_patrimonio`(`idbem`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hd.itens_patrimonio_status_historico` ADD CONSTRAINT `hd.itens_patrimonio_status_historico_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `principal.usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
