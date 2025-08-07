# API /empreendimento/getall

## Finalidade
Rota responsável por buscar a lista completa de todos os empreendimentos cadastrados no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/empreendimento`.
4.  A requisição utiliza caching do Next.js, associando os dados à tag `empreendimento-all` e definindo um tempo de revalidação de 30 minutos (`revalidate: 60 * 30`).
5.  Retorna a lista de empreendimentos encontrados.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/empreendimento/getall
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 25,
    "attributes": { "Nome": "Residencial Sol Nascente" }
  },
  {
    "id": 26,
    "attributes": { "Nome": "Condomínio Vista Verde" }
  }
]
```
- **Erro:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- O uso de `next: { tags: ["empreendimento-all"] }` permite a invalidação granular do cache. Quando um empreendimento é criado, atualizado ou excluído, a função `revalidateTag("empreendimento-all")` pode ser chamada para forçar a atualização desta lista.

## Arquivo
- `src/app/api/empreendimento/getall/route.ts`
