# API /suporte/post

## Finalidade
Rota responsável por receber um arquivo (`FormData`) e enviá-lo para um servidor externo de uploads de suporte.

## Método
- **POST**

## Fluxo
1.  Recebe um corpo de requisição do tipo `multipart/form-data`.
2.  Extrai o arquivo da chave `file` do `FormData`.
3.  Se nenhum arquivo for encontrado, retorna um erro.
4.  Envia o `FormData` completo em uma requisição `POST` para o servidor de uploads externo no endpoint `https://uploadsuporte.redebrasilrp.com.br/upload/suporte`.
5.  A requisição é feita sem cache (`no-store`).
6.  Retorna a resposta do servidor externo, que deve conter informações sobre o arquivo enviado.
7.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
A requisição deve ser do tipo `multipart/form-data` com um campo `file` contendo o arquivo.

**Exemplo (cURL):**
```bash
curl -X POST \
  http://localhost:3000/api/suporte/post \
  -F 'file=@/caminho/para/seu/arquivo.jpg'
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": {
    "fileName": "suporte_1678886400000.jpg",
    "filePath": "/uploads/suporte/suporte_1678886400000.jpg"
  },
  "message": "Arquivo enviado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Arquivo não informado, por favor entre em contato com o Suporte"
}
```

## Observações
- **ALERTA DE SEGURANÇA GRAVE:** Esta rota é **pública e não possui nenhum tipo de autenticação (`GetSessionServer`)**. Isso permite que qualquer pessoa com acesso à URL da API envie arquivos para o servidor de suporte, o que pode levar ao esgotamento de espaço em disco, upload de arquivos maliciosos e outros riscos de segurança. É **altamente recomendável** a implementação de um mecanismo de autenticação e autorização para esta rota.

## Arquivo
- `src/app/api/suporte/post/route.ts`
