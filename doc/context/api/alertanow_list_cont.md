# API /alertanow/list/cont

## Finalidade
Rota responsável por obter a contagem total de solicitações classificadas como "agora" (now), ou seja, o número de alertas ou itens de alta prioridade.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/solicitacao/list/now/cont`.
4.  A requisição inclui caching com revalidação a cada 30 minutos (`revalidate: 60 * 30`) e a tag `alertanow-list-cont`.
5.  Retorna a contagem de solicitações fornecida pelo backend.
6.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status apropriado.

## Exemplo de Request
```http
GET /api/alertanow/list/cont
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "count": 5
}
```
- **Erro:**
```json
{
  "error": "Erro ao buscar contagem"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- **Estrutura de Rota Incomum:** A rota está aninhada em `/list/cont`, o que é pouco intuitivo. Uma estrutura mais clara e alinhada com as práticas RESTful seria ter uma rota dedicada, como `/api/alertanow/count`, para obter a contagem.
- Utiliza caching do Next.js para otimizar o desempenho.

## Arquivo
- `src/app/api/alertanow/list/cont/route.ts`
