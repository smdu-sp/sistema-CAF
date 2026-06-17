-- Restaura papel operacional (help desk) removido em 20260513171925_permissoes.
-- Convive com o sistema granular UsuarioPermissao (módulos reserva_salas, etc.).

ALTER TABLE `principal.usuarios`
  ADD COLUMN `permissao` ENUM('DEV', 'ADM', 'TEC', 'SUP', 'PAT', 'USR') NOT NULL DEFAULT 'USR';

UPDATE `principal.usuarios` SET `permissao` = 'DEV' WHERE `desenvolvedor` = true;
