-- AlterEnum: SUP (supervisor help desk) e PAT (gestor patrimônio)
ALTER TABLE `principal.usuarios` MODIFY `permissao` ENUM('DEV', 'ADM', 'TEC', 'SUP', 'PAT', 'USR') NOT NULL DEFAULT 'USR';
