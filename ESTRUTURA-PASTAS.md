# Estrutura de Pastas

Mapa de pastas e subpastas do projeto. Pastas geradas ou de dependencias, como `node_modules`, `.next` e `.git`, nao foram listadas.

```text
projeto-nova-intranet/
|-- .cursor/
|   `-- rules/
|-- .vscode/
|-- app/
|   |-- (intranet)/
|   |   |-- exemplo-temporario/
|   |   |   |-- figma-assets/
|   |   |   `-- uploads/
|   |   `-- intranet/
|   |       |-- _components/
|   |       |-- aniversarios/
|   |       |   `-- _components/
|   |       |-- comunicados/
|   |       |   `-- _components/
|   |       |-- eventos/
|   |       |   `-- _components/
|   |       |-- feed/
|   |       |   `-- _components/
|   |       `-- perfil/
|   |           `-- _components/
|   |-- (rotas-auth)/
|   |   |-- (rotas-dev)/
|   |   |   |-- coordenadorias/
|   |   |   |   `-- _components/
|   |   |   |-- permissoes/
|   |   |   |   `-- _components/
|   |   |   `-- usuarios/
|   |   |       `-- _components/
|   |   |-- avaliacao-limpeza/
|   |   |   |-- _components/
|   |   |   |-- categorias/
|   |   |   |-- criterios/
|   |   |   `-- salas/
|   |   |       |-- _components/
|   |   |       `-- [id]/
|   |   |-- reserva-salas/
|   |   |   |-- _components/
|   |   |   |-- admin/
|   |   |   |   `-- _components/
|   |   |   |-- agenda/
|   |   |   |-- minhas/
|   |   |   |   `-- _components/
|   |   |   |-- nova/
|   |   |   |-- salas/
|   |   |   |   |-- _components/
|   |   |   |   `-- [id]/
|   |   |   `-- services/
|   |   `-- salas/
|   |-- (rotas-livres)/
|   |   `-- login/
|   |       `-- _components/
|   |-- api/
|   |   |-- auth/
|   |   |   `-- [...nextauth]/
|   |   |-- avaliacaolimpezas/
|   |   |   `-- salas/
|   |   |       `-- [id]/
|   |   |-- coordenadorias/
|   |   |   `-- [id]/
|   |   |-- permissoes/
|   |   |-- reservas/
|   |   |   |-- admin/
|   |   |   |-- proximos/
|   |   |   `-- solicitacoes/
|   |   |-- salas/
|   |   |   `-- [id]/
|   |   |       `-- layout-imagem/
|   |   |           `-- [fotoId]/
|   |   `-- usuarios/
|   |       |-- [id]/
|   |       |-- busca/
|   |       |-- desenvolvedor/
|   |       |-- importar/
|   |       |-- importar-lote/
|   |       `-- permissoes/
|   |           |-- desenvolvedor/
|   |           `-- validar/
|   |               `-- [permissao]/
|   `-- dashboard/
|       |-- components/
|       `-- services/
|-- components/
|   |-- sidebar/
|   |-- tabs-nav/
|   `-- ui/
|-- hooks/
|-- lib/
|   `-- auth/
|-- prisma/
|   |-- generated/
|   |   `-- runtime/
|   |-- migrations/
|   |   |-- 20260507170254_inicial/
|   |   |-- 20260513171925_permissoes/
|   |   `-- 20260515144408_reserva_salas/
|   `-- schema/
|-- providers/
|-- public/
|   `-- uploads/
|       `-- salas/
|-- scripts/
|-- services/
|   |-- permissoes/
|   `-- usuarios/
|       `-- query-functions/
`-- types/
```
