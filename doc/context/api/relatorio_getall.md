# API /relatorio/getall

## Finalidade
Rota responsável por buscar dados numéricos e estatísticos gerais para os relatórios. O nome `getall` é um pouco genérico; a rota, na verdade, busca um conjunto específico de dados agregados do backend.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se não houver sessão, a sessão atual é explicitamente deletada (`DeleteSession`) e um erro 401 é retornado.
4.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/relatorio/numeros/geral`.
5.  A requisição utiliza caching do Next.js, associando os dados à tag `relatorio-all` e definindo um tempo de revalidação de 30 minutos (`revalidate: 60 * 30`).
6.  Retorna os dados numéricos encontrados.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/relatorio/getall
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "totalVendas": 150,
  "totalLeads": 800,
  "taxaConversao": 0.1875
}
```
- **Erro:**
```json
{
  "error": true,
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- O endpoint no Strapi (`/relatorio/numeros/geral`) indica que esta rota não busca uma lista de relatórios, mas sim dados consolidados para um dashboard ou visão geral.
- O uso de `next: { tags: ["relatorio-all"] }` permite a invalidação do cache quando os dados base para esses números forem atualizados.

## Arquivo
- `src/app/api/relatorio/getall/route.ts`
