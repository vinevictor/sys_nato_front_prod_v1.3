# API /alerts/create

## Finalidade
Rota responsável por criar um novo alerta no sistema.

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
POST /api/alerts/create
{
  "titulo": "Novo Alerta de Manutenção",
  "mensagem": "O sistema ficará indisponível no próximo domingo.",
  "tipo": "informativo"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 10,
  "attributes": {
    "titulo": "Novo Alerta de Manutenção",
    // ... outros campos do alerta
  }
}
```
- **Erro (Permissão):**
```json
{
  "message": "Você não tem permissão para criar um alerta"
}
```

## Observações
- **Excelente Prática de Segurança (RBAC):** A rota implementa um controle de acesso baseado em função (Role-Based Access Control), verificando se o usuário possui a permissão específica `session.user?.role?.alert` antes de permitir a criação. Isso impede que usuários autenticados, mas não autorizados, executem a ação.
- **Invalidação de Cache:** A rota invalida corretamente a tag `alert-geral-all`, garantindo que as listas de alertas sejam atualizadas após a criação.
- **Bug Potencial no Tratamento de Erros:** O bloco `catch` tenta executar `error.message.join("\n")`. Isso causará um erro se `error.message` for uma string (o que é comum), pois o método `.join()` não existe para strings. O tratamento de erro deve ser corrigido para lidar com diferentes formatos de mensagem de erro de forma mais robusta.

## Arquivo
- `src/app/api/alerts/create/route.ts`
