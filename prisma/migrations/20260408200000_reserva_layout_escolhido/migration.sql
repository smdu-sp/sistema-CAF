-- AlterTable
ALTER TABLE `reservas` ADD COLUMN `layoutEscolhidoDescricao` VARCHAR(120) NULL,
    ADD COLUMN `salaLayoutFotoId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `reservas_salaLayoutFotoId_idx` ON `reservas`(`salaLayoutFotoId`);

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_salaLayoutFotoId_fkey` FOREIGN KEY (`salaLayoutFotoId`) REFERENCES `sala_layout_fotos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
