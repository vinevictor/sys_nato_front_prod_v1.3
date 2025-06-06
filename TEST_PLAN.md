# Plano de Testes Manuais - CRM Natov2

Este documento descreve os cenários de teste manuais para o projeto CRM Natov2.

## Módulo de Acesso Público

### 1. Login
- [ ] Tentar login com credenciais válidas.
- [ ] Tentar login com email inválido.
- [ ] Tentar login com senha inválida.
- [ ] Tentar login com campos em branco.

### 2. Página de Suporte/FAQ
- [ ] Acessar a página de Suporte/FAQ.
- [ ] Verificar se o conteúdo é exibido corretamente.
- [ ] Testar a interatividade (se houver, como expansão de perguntas).

### 3. Página de Termos de Uso
- [ ] Acessar a página de Termos de Uso.
- [ ] Verificar se o conteúdo é exibido corretamente.

## Módulo de Rotas Privadas (após login bem-sucedido)

### 4. Dashboard
- [ ] Verificar se o dashboard principal é carregado após o login.
- [ ] Verificar se os principais indicadores/informações são exibidos.

### 5. Chamados
- [ ] Acessar a listagem de chamados.
- [ ] Tentar criar um novo chamado (preenchendo todos os campos obrigatórios).
- [ ] Tentar criar um novo chamado sem preencher campos obrigatórios (verificar validações).
- [ ] Visualizar detalhes de um chamado existente.
- [ ] Tentar editar um chamado existente.
- [ ] Tentar excluir um chamado (se a funcionalidade existir).
- [ ] Testar filtros e busca na listagem de chamados (se existir).
- [ ] *Detalhar: Quais são os status possíveis de um chamado? Existem fluxos de aprovação?*

### 6. Direto
- [ ] Acessar a funcionalidade "Direto".
- [ ] Testar as ações principais disponíveis nesta seção.
- [ ] *Detalhar: Qual é o objetivo principal desta seção? Quais ações o usuário pode realizar?*

### 7. Solicitações
- [ ] Acessar a listagem de solicitações.
- [ ] Verificar se as solicitações são exibidas corretamente.
- [ ] Testar ações como aprovar/reprovar solicitações (se aplicável).
- [ ] Testar filtros e busca na listagem de solicitações (se existir).
- [ ] *Detalhar: Que tipos de solicitações são gerenciadas? Quais são os fluxos?*

## Módulo Administrativo (requer perfil de administrador)

### 8. Gerenciamento de Usuários (`usuarios`)
- [ ] Acessar a listagem de usuários.
- [ ] Tentar criar um novo usuário com dados válidos.
- [ ] Tentar criar um novo usuário com dados inválidos ou campos obrigatórios faltando.
- [ ] Visualizar detalhes de um usuário existente.
- [ ] Tentar editar um usuário existente (alterar nome, email, perfil, etc.).
- [ ] Tentar editar um usuário e salvar sem fazer alterações.
- [ ] Tentar desativar/ativar um usuário (se a funcionalidade existir).
- [ ] Tentar excluir um usuário.
- [ ] Testar filtros e busca na listagem de usuários.

### 9. Gerenciamento de Administradores (`adm`)
- [ ] Acessar a listagem de administradores.
- [ ] Tentar criar um novo administrador.
- [ ] Tentar editar um administrador existente.
- [ ] Tentar excluir um administrador.
- [ ] *Detalhar: Esta seção realmente gerencia outros administradores ou tem outra finalidade?*

### 10. Gerenciamento de Construtoras (`construtoras`)
- [ ] Acessar a listagem de construtoras.
- [ ] Tentar criar uma nova construtora.
- [ ] Tentar editar uma construtora existente.
- [ ] Tentar excluir uma construtora.

### 11. Gerenciamento de Empreendimentos (`empreendimentos`)
- [ ] Acessar a listagem de empreendimentos.
- [ ] Tentar criar um novo empreendimento.
- [ ] Tentar editar um empreendimento existente.
- [ ] Tentar excluir um empreendimento.

### 12. Gerenciamento de Financeiras (`financeiras`)
- [ ] Acessar a listagem de financeiras.
- [ ] Tentar criar uma nova financeira.
- [ ] Tentar editar uma financeira existente.
- [ ] Tentar excluir uma financeira.

### 13. Gerenciamento de Tags (`tags`)
- [ ] Acessar a listagem de tags.
- [ ] Tentar criar uma nova tag.
- [ ] Tentar editar uma tag existente.
- [ ] Tentar excluir uma tag.

## Testes Gerais (aplicáveis a várias partes do sistema)

### 14. Responsividade
- [ ] Verificar a aparência e funcionalidade em diferentes tamanhos de tela (desktop, tablet, mobile).

### 15. Navegação
- [ ] Testar todos os links de navegação (menu principal, breadcrumbs, etc.).
- [ ] Verificar se o usuário é redirecionado corretamente.

### 16. Tratamento de Erros
- [ ] Forçar erros (ex: tentar acessar uma URL inexistente ou uma funcionalidade sem permissão).
- [ ] Verificar se mensagens de erro amigáveis são exibidas.

### 17. Performance
- [ ] Observar o tempo de carregamento das páginas e ações principais.

### 18. Consistência da Interface
- [ ] Verificar se a interface do usuário (cores, fontes, botões) é consistente em todo o sistema.
