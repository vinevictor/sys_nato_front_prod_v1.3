# API /alerts/geral

## Finalidade
Rota responsável por criar um novo alerta geral no sistema. Funcionalmente, é idêntica à rota `/api/alerts/create`.

## Método
- **POST**

## Fluxo
1.  Recebe os dados do alerta no corpo (body) da requisição em formato JSON.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Verifica se o usuário possui a permissão específica para criar alertas (`session.user?.role?.alert`).
4.  Se autenticado e autorizado, envia uma requisição `POST` para a API do Strapi no endpoint `/alert` com os dados do novo alerta.
5.  Após a requisição, invalida o cache do Next.js para a tag `alert-geral-all` para garantir que a lista geral de alertas seja atualizada.
6.  Retorna a resposta da API do Strapi.
7.  Em caso de falha, retorna uma mensagem de erro apropriada.

## Exemplo de Request
```json
POST /api/alerts/geral
{
  "titulo": "Alerta Geral",
  "mensagem": "Mensagem do alerta geral.",
  "tipo": "aviso"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 11,
  "attributes": {
    "titulo": "Alerta Geral",
    // ... outros campos do alerta
  }
}
```
- **Erro (Permissão):**
```json
{
  "message": "Você não tem permissão para adicionar um alerta"
}
```

## Observações
- **FALHA DE ARQUITETURA (REDUNDÂNCIA):** Esta rota é uma duplicata exata da rota `/api/alerts/create`. Ambas executam a mesma lógica, verificam a mesma permissão e invalidam a mesma tag de cache. Manter rotas duplicadas aumenta a complexidade, o risco de inconsistências e a sobrecarga de manutenção. Uma delas deve ser removida para simplificar a API.
- **Excelente Prática de Segurança (RBAC):** Assim como a rota duplicada, esta implementa corretamente o controle de acesso baseado em função (RBAC), verificando a permissão `session.user?.role?.alert`.
- **Bug Potencial no Tratamento de Erros:** O bloco `catch` contém o mesmo bug potencial das outras rotas, tentando usar `.join()` em uma string de mensagem de erro.

## Arquivo
- `src/app/api/alerts/geral/route.ts`
