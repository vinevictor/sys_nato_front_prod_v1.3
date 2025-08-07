# API /videosfaq/getall

## Finalidade
Rota responsável por buscar a lista completa de vídeos de FAQ de uma API externa e formatar as URLs para visualização.

## Método
- **GET**

## Fluxo
1.  Envia uma requisição `GET` para uma API externa, cujo endpoint está definido na variável de ambiente `EXPRESS_API_VIDEOS_FAQ`.
2.  Recebe a lista de vídeos da API externa.
3.  Mapeia a lista recebida e transforma os dados de cada vídeo:
    - Mantém o `id` e o `title`.
    - Constrói uma nova URL para o vídeo (`src`) concatenando o valor da variável de ambiente `ROUTE_API_VIEW_VIDEO` com o `src` original do vídeo.
4.  Retorna a lista de vídeos com as URLs formatadas.
5.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/videosfaq/getall
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "src": "https://api-de-videos.exemplo.com/view/video_tutorial_01.mp4",
    "title": "Como abrir um chamado"
  },
  {
    "id": 2,
    "src": "https://api-de-videos.exemplo.com/view/video_tutorial_02.mp4",
    "title": "Como resetar sua senha"
  }
]
```
- **Erro:**
```json
{
  "message": "Invalid credentials"
}
```

## Observações
- Esta rota é **pública** e não requer autenticação.
- A funcionalidade depende criticamente de duas variáveis de ambiente:
    - `EXPRESS_API_VIDEOS_FAQ`: A URL base da API externa que fornece a lista de vídeos.
    - `ROUTE_API_VIEW_VIDEO`: O prefixo da URL usado para construir o link de visualização final do vídeo.
- A rota é marcada como `force-dynamic`, garantindo que a lista de vídeos seja sempre buscada em tempo real.

## Arquivo
- `src/app/api/videosfaq/getall/route.ts`
