# API /relatorio/doc/[protocolo]/xlsx

## Finalidade
Rota responsável por fazer o download de um relatório específico, identificado por seu `protocolo`, no formato XLSX (Excel).

## Método
- **GET**

## Fluxo
1.  Recebe o `protocolo` do relatório na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/relatorio/download/xlsx/{protocolo}`.
4.  A requisição para o Strapi é autenticada com o token do usuário.
5.  A rota espera receber um arquivo XLSX como resposta do Strapi.
6.  O corpo da resposta (o arquivo) é lido como um `arrayBuffer` e convertido para um `Buffer` do Node.js.
7.  A rota captura o cabeçalho `Content-Disposition` da resposta do Strapi para determinar como o navegador deve tratar o arquivo (ex: `attachment; filename="relatorio.xlsx"`).
8.  Retorna uma `NextResponse` com o buffer do XLSX, status 200 e os cabeçalhos apropriados (`Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` e `Content-Disposition`), efetivamente transmitindo o arquivo para o cliente.

## Exemplo de Request
```http
GET /api/relatorio/doc/12345-ABC/xlsx
```

## Exemplo de Response
- **Sucesso:**
  - O corpo da resposta é o conteúdo binário do arquivo XLSX.
  - **Cabeçalhos:**
    ```
    Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    Content-Disposition: attachment; filename="relatorio_12345-ABC.xlsx"
    ```
- **Erro:**
```json
{
  "message": "Usuário não autenticado"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- Funcionalmente idêntica à rota de download de PDF, apenas muda o endpoint no Strapi e o `Content-Type` na resposta para servir um arquivo Excel.
- Atua como um proxy seguro para o download de arquivos.

## Arquivo
- `src/app/api/relatorio/doc/[protocolo]/xlsx/route.ts`
