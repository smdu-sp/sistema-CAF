-- Normaliza valores legados antes de converter para enum
UPDATE `salas`
SET `layout` = 'MOVEL'
WHERE UPPER(`layout`) IN ('MOVEL', 'MÓVEL');

UPDATE `salas`
SET `layout` = 'FIXO'
WHERE UPPER(`layout`) = 'FIXO';

UPDATE `salas`
SET `layout` = NULL
WHERE `layout` IS NOT NULL
  AND UPPER(`layout`) NOT IN ('MOVEL', 'MÓVEL', 'FIXO');

-- Converte coluna para enum do Prisma
ALTER TABLE `salas`
  MODIFY `layout` ENUM('MOVEL', 'FIXO') NULL;
