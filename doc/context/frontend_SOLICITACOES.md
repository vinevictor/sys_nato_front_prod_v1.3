# Documentação da Página SOLICITAÇÕES

## Finalidade
A página Solicitações permite ao usuário visualizar, criar, editar e gerenciar solicitações de serviços/processos, sendo um dos principais fluxos do sistema.

## Fluxo de Navegação
- Usuário acessa `/solicitacoes` para ver a lista de solicitações.
- Pode iniciar uma nova solicitação ou acessar detalhes/editá-la.
- Fluxo guiado por modais e formulários dinâmicos.

## Componentes Envolvidos
- **Página de Listagem:** `src/app/(private_route)/solicitacoes/page.tsx`
- **Componente Principal:** `src/components/solicitacao/index.tsx` (`SolicitacaoSWITCH`)
- **Componentes Auxiliares:**
  - `src/components/solicitacao/modal/ModalConsultaRegistro.tsx`: consulta de CPF.
  - `src/components/solicitacao/form/FormSolicitacao.tsx`: formulário de criação/edição.
  - `src/components/form/solicitacao/edit/index.tsx`: edição avançada de solicitações.
  - `src/components/mensagensChat/index.tsx`: chat interno da solicitação.
  - `src/components/solicitacao/alert/index.tsx`: alertas específicos.
  - `src/components/logsComponent/index.tsx`: histórico de alterações (ADM).

## Lógica Central
- Busca e exibição dinâmica da lista de solicitações.
- Fluxo de criação/edição guiado por modais e validações.
- Atualização dos dados em tempo real após operações.
- Permissões definem quais ações estão disponíveis.

## Padrões e Boas Práticas
- Separação de lógica de apresentação e negócio.
- Uso de modais para etapas sensíveis.
- Validação forte de dados antes de submissão.

## Pontos de Atenção
- Garantir atualização da lista após operações.
- Tratar erros de backend e feedback ao usuário.
- Controle de permissões para ações sensíveis.

## Links Relacionados
- [src/app/(private_route)/solicitacoes/page.tsx](../../src/app/(private_route)/solicitacoes/page.tsx)
- [src/components/solicitacao/index.tsx](../../src/components/solicitacao/index.tsx)
- [src/components/solicitacao/modal/ModalConsultaRegistro.tsx](../../src/components/solicitacao/modal/ModalConsultaRegistro.tsx)
- [src/components/solicitacao/form/FormSolicitacao.tsx](../../src/components/solicitacao/form/FormSolicitacao.tsx)
- [src/components/form/solicitacao/edit/index.tsx](../../src/components/form/solicitacao/edit/index.tsx)
- [src/components/mensagensChat/index.tsx](../../src/components/mensagensChat/index.tsx)
- [src/components/solicitacao/alert/index.tsx](../../src/components/solicitacao/alert/index.tsx)
- [src/components/logsComponent/index.tsx](../../src/components/logsComponent/index.tsx)
