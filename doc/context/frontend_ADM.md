# Documentação da Página ADM (Painel Administrativo)

## Finalidade
A página ADM é o dashboard administrativo do sistema, fornecendo visão geral, estatísticas, relatórios financeiros e gerenciamento centralizado de entidades (usuários, construtoras, empreendimentos, financeiras e tags).

## Fluxo de Navegação
- Usuário com permissão de administrador acessa `/adm`.
- Visualiza cards com estatísticas gerais, relatórios e alertas.
- Pode acessar subpáginas para gerenciar usuários, construtoras, empreendimentos, financeiras e tags.
- Permite criação rápida de cobranças e alertas via modais.

## Componentes Envolvidos
- **Página Principal:** `src/app/(private_route)/(adiministrativo)/adm/page.tsx`
- **Componente Principal:** `src/components/adm/index.tsx` (`AdmSwitch`)
- **Cards/Relatórios:**
  - `src/components/adm/cardUsuario/index.tsx` (usuários)
  - `src/components/adm/cardConstrutora/index.tsx` (construtoras)
  - `src/components/adm/cardEmpreendimento/index.tsx` (empreendimentos)
  - `src/components/adm/cardFinanceira/index.tsx` (financeiras)
  - `src/components/adm/relatorioFinanceiro/index.tsx` (relatórios)
  - `src/components/adm/alertas/index.tsx` (alertas)
- **Modais:**
  - `src/components/adm/modal/ModalAddCobranca.tsx`
  - `src/components/adm/modal/ModalAddAlerta.tsx`

## Lógica Central
- Busca de dados e estatísticas via API.
- Renderização condicional de cards e relatórios conforme permissões.
- Ações rápidas via modais para cobranças e alertas.

## Padrões e Boas Práticas
- Separação clara entre dashboard e subgestões.
- Feedback visual para todas as ações administrativas.
- Controle rigoroso de permissões.

## Pontos de Atenção
- Garantir atualização dos dados após operações administrativas.
- Tratar erros e garantir logs de ações sensíveis.

## Links Relacionados
- [src/app/(private_route)/(adiministrativo)/adm/page.tsx](../../src/app/(private_route)/(adiministrativo)/adm/page.tsx)
- [src/components/adm/index.tsx](../../src/components/adm/index.tsx)
