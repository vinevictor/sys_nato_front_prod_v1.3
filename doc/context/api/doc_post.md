# API /doc/post

## Finalidade
Rota genérica para upload de arquivos. Ela recebe um arquivo e um tipo, e encaminha para o endpoint correspondente no backend Strapi.

## Método
- **POST**

## Tipo de Conteúdo
- `multipart/form-data`

## Fluxo
1.  Recebe uma requisição `POST` com dados de formulário (`formData`).
2.  Extrai o arquivo (`file`) e o tipo do documento (`type`) do formulário.
3.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
4.  Constrói dinamicamente a URL do backend usando o `type` fornecido (ex: `/file/rg_frente`).
5.  Se autenticado, envia o arquivo para a API do Strapi usando `multipart/form-data`.
6.  Retorna a resposta da API do Strapi, que geralmente contém os detalhes do arquivo salvo.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
O request deve ser do tipo `multipart/form-data`.

- **Campo 1:**
  - **key:** `file`
  - **value:** (o arquivo a ser enviado)
- **Campo 2:**
  - **key:** `type`
  - **value:** `rg_frente` (ou outro tipo de documento)

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": {
    "id": 123,
    "name": "rg_frente.jpg",
    "url": "/uploads/rg_frente_abc123.jpg"
    // ... outros dados do arquivo
  },
  "message": "Arquivo enviado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Erro ao enviar o arquivo, por favor entre em contato com o Suporte"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- **Endpoint Dinâmico:** A rota é altamente flexível, pois o endpoint de destino no backend é determinado pelo valor do campo `type` enviado no formulário. Isso a torna uma rota de upload genérica.
- **Inconsistência de Cache:** A rota não invalida nenhuma tag de cache (`revalidateTag`) após o upload bem-sucedido. Isso pode fazer com que as interfaces que listam documentos não sejam atualizadas imediatamente.

## Arquivo
- `src/app/api/doc/post/route.ts`
