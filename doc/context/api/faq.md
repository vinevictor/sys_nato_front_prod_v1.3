# API /faq

## Finalidade
Rota pública responsável por buscar uma lista de arquivos (presumivelmente vídeos de FAQ) de um diretório específico no backend.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Envia uma requisição GET para a API do Strapi no endpoint `/file/sisnato/videos/faq`.
3.  A requisição não requer autenticação.
4.  A resposta é cacheada por 1 hora (`revalidate: 60 * 60`).
5.  Retorna a lista de arquivos encontrada.
6.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/faq
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "name": "como_abrir_chamado.mp4",
    "url": "/uploads/como_abrir_chamado_12345.mp4",
    "size": 5242880
  },
  {
    "name": "resetar_senha.mp4",
    "url": "/uploads/resetar_senha_67890.mp4",
    "size": 3145728
  }
]
```
- **Erro:**
```json
{
  "message": "Erro ao buscar arquivos"
}
```

## Observações
- Esta é uma rota pública, não exigindo autenticação, o que é adequado para conteúdo de ajuda como FAQs.
- A rota utiliza caching do Next.js para otimizar o desempenho, revalidando os dados a cada hora. Isso é eficiente para conteúdos que não mudam com frequência.

## Arquivo
- `src/app/api/faq/route.ts`
