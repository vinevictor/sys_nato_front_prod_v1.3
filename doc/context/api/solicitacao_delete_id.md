# API /solicitacao/delete/[id]

## Finalidade
Rota responsável por excluir (ou desativar) uma `solicitacao` específica, identificada pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` da solicitação na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/solicitacao/delete/{id}`.
4.  Retorna a resposta da API do Strapi, que deve confirmar a exclusão.
5.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
DELETE /api/solicitacao/delete/250
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "status": "cancelada"
    // ... outros dados da solicitação excluída
  }
}
```
- **Erro:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- A rota é marcada como `force-dynamic`, então não há cache envolvido.
- O endpoint no Strapi (`/solicitacao/delete/{id}`) é consistente com a rota da API Next.js, o que é uma boa prática.

## Arquivo
- `src/app/api/solicitacao/delete/[id]/route.ts`
