# API /direto/tags/getall

## Finalidade
Rota responsável por buscar a lista completa de todas as tags disponíveis no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/tag-list`.
4.  Retorna a lista de tags encontradas.
5.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/direto/tags/getall
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "attributes": { "nome": "Urgente" }
  },
  {
    "id": 2,
    "attributes": { "nome": "Revisar" }
  }
]
```
- **Não Encontrado:**
```json
{
  "message": "Solicitação não encontrada"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- **Redundância de Rota:** Embora a rota esteja no caminho `/direto/tags`, ela busca os dados do endpoint genérico `/tag-list` no backend. O projeto já possui uma rota de nível superior em `/api/tag-list` que executa a mesma função. Esta rota em `/direto/tags/getall` é uma duplicata desnecessária e deve ser removida para centralizar a lógica e evitar inconsistências de manutenção.

## Arquivo
- `src/app/api/direto/tags/getall/route.ts`
