# API /relatorio/doc/[protocolo]/pdf

## Finalidade
Rota responsável por fazer o download de um relatório específico, identificado por seu `protocolo`, no formato PDF.

## Método
- **GET**

## Fluxo
1.  Recebe o `protocolo` do relatório na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/relatorio/download/pdf/{protocolo}`.
4.  A requisição para o Strapi é autenticada com o token do usuário.
5.  A rota espera receber um arquivo PDF como resposta do Strapi.
6.  O corpo da resposta (o arquivo) é lido como um `arrayBuffer` e convertido para um `Buffer` do Node.js.
7.  A rota captura o cabeçalho `Content-Disposition` da resposta do Strapi para determinar como o navegador deve tratar o arquivo (ex: `attachment; filename="relatorio.pdf"`).
8.  Retorna uma `NextResponse` com o buffer do PDF, status 200 e os cabeçalhos apropriados (`Content-Type: application/pdf` e `Content-Disposition`), efetivamente transmitindo o arquivo para o cliente.

## Exemplo de Request
```http
GET /api/relatorio/doc/12345-ABC/pdf
```

## Exemplo de Response
- **Sucesso:**
  - O corpo da resposta é o conteúdo binário do arquivo PDF.
  - **Cabeçalhos:**
    ```
    Content-Type: application/pdf
    Content-Disposition: attachment; filename="relatorio_12345-ABC.pdf"
    ```
- **Erro:**
```json
{
  "message": "Usuário não autenticado"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- Atua como um proxy seguro para o download de arquivos do backend (Strapi), garantindo que apenas usuários autenticados possam acessar os relatórios.
- A manipulação de `Buffer` e cabeçalhos é essencial para o correto funcionamento do download no navegador do cliente.

## Arquivo
- `src/app/api/relatorio/doc/[protocolo]/pdf/route.ts`
