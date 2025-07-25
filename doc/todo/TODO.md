# Lista de Tarefas do Projeto (TODO)

Esta lista de tarefas rastreia as melhorias e os itens pendentes para o projeto `sys_nato_front_prod_v1.3`.

## Melhorias Gerais

- [ ] **Documentação de Componentes**: Adicionar comentários JSDoc a todos os componentes em `src/components`, explicando suas props, responsabilidades e exemplos de uso.
- [ ] **Revisão de Acessibilidade (a11y)**: Realizar uma auditoria completa de acessibilidade nos componentes da UI, garantindo a conformidade com as diretrizes WCAG. Validar o contraste de cores, a navegação por teclado e o uso de atributos ARIA.
- [ ] **Otimização de Performance**: Analisar o bundle da aplicação com `@next/bundle-analyzer` para identificar e otimizar pacotes pesados. Otimizar o carregamento de imagens usando o componente `next/image`.

## Testes

- [ ] **Testes Unitários para Hooks**: Implementar testes unitários para todos os hooks customizados na pasta `src/hook`.
- [ ] **Testes Unitários para Libs**: Criar testes para as funções críticas de utilidade na pasta `src/lib`, especialmente as relacionadas à autenticação e formatação de dados.
- [ ] **Testes de Integração para API Routes**: Desenvolver testes de integração para os endpoints da API localizados em `src/app/api` para garantir que as requisições e respostas funcionem como esperado.

## Refatoração

- [ ] **Padronizar Respostas da API**: Garantir que todas as API Routes sigam um padrão de resposta consistente para sucesso e erro.
- [ ] **Revisar Gerenciamento de Estado**: Avaliar o uso de `Context API` e `useState` para identificar oportunidades de refatoração, visando um gerenciamento de estado mais eficiente e menos propenso a re-renderizações desnecessárias.
