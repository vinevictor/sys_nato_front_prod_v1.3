# API /empreendimento/delete/[id]

## Finalidade
Rota responsável por excluir (ou desativar, dependendo da lógica do backend) um empreendimento específico, identificado pelo seu ID.

## Método
- **DELETE**

## Fluxo
1.  Recebe o `id` do empreendimento na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `DELETE` para a API do Strapi no endpoint `/empreendimento/delete/{id}`.
4.  Se a exclusão for bem-sucedida, invalida o cache de dados associado à tag `empreendimento-all` usando `revalidateTag`.
5.  Retorna a resposta da API do Strapi, que geralmente confirma a exclusão.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
DELETE /api/empreendimento/delete/25
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 25,
  "attributes": {
    "Nome": "Residencial Sol Nascente",
    "Status": "inativo"
    // ... outros dados do empreendimento excluído
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
- A chamada a `revalidateTag("empreendimento-all")` é crucial para garantir que as listas de empreendimentos exibidas no frontend sejam atualizadas após uma exclusão, removendo dados em cache.

## Arquivo
- `src/app/api/empreendimento/delete/[id]/route.ts`
