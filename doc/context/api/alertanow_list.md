# API /alertanow/list

## Finalidade
Rota responsável por buscar uma lista de solicitações classificadas como "agora" (now), provavelmente alertas ou itens de alta prioridade que precisam de atenção imediata.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/solicitacao/list/now/get`.
4.  A requisição inclui caching com revalidação a cada 30 minutos (`revalidate: 60 * 30`) e a tag `alertanow-list`.
5.  Retorna a lista de solicitações fornecida pelo backend.
6.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status apropriado.

## Exemplo de Request
```http
GET /api/alertanow/list
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "titulo": "Alerta Urgente 1",
    "status": "Pendente"
  },
  {
    "id": 2,
    "titulo": "Alerta Urgente 2",
    "status": "Em Análise"
  }
]
```
- **Erro:**
```json
{
  "error": "Erro ao buscar lista"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- Utiliza caching do Next.js para otimizar o desempenho, revalidando os dados a cada 30 minutos.

## Arquivo
- `src/app/api/alertanow/list/route.ts`
