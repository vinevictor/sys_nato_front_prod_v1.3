# API /bug_report/create

## Finalidade
Rota responsável por criar um novo relatório de bug (bug report) no sistema.

## Método
- **POST**

## Fluxo
1.  Recebe os dados do relatório de bug no corpo (body) da requisição em formato JSON.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `POST` para a API do Strapi no endpoint `/bug` com os dados do novo relatório.
4.  Após a criação bem-sucedida, invalida o cache do Next.js para a tag `bug-report-all` para garantir que a lista de bugs seja atualizada.
5.  Retorna a resposta da API do Strapi.
6.  Em caso de falha, retorna uma mensagem de erro apropriada.

## Exemplo de Request
```json
POST /api/bug_report/create
{
  "titulo": "Erro na página de login",
  "descricao": "A página de login não carrega no navegador Firefox.",
  "prioridade": "alta"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 2,
  "attributes": {
    "titulo": "Erro na página de login",
    // ... outros campos do bug report
  }
}
```
- **Erro:**
```json
{
  "message": "Erro ao adicionar bug"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- A invalidação do cache (`revalidateTag`) é crucial para manter a consistência dos dados na interface.

## Arquivo
- `src/app/api/bug_report/create/route.ts`
