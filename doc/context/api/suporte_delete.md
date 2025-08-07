# API /suporte/delete

## Finalidade
Rota responsável por excluir um arquivo do servidor externo de uploads de suporte.

## Método
- **DELETE**

## Fluxo
1.  Recebe um corpo (body) de requisição em formato JSON contendo o nome do arquivo a ser excluído (a chave deve ser `image`).
2.  Envia uma requisição `DELETE` para o servidor de uploads externo no endpoint `https://uploadsuporte.redebrasilrp.com.br/delete/suporte/{nome_do_arquivo}`.
3.  Retorna a resposta do servidor externo, indicando sucesso ou falha na exclusão.
4.  Em caso de falha na comunicação ou erro no servidor externo, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
DELETE /api/suporte/delete
{
  "image": "arquivo_de_exemplo.pdf"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": { /* ...resposta do servidor externo... */ },
  "message": "Arquivo deletado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Erro ao deletar o arquivo: {detalhes_do_erro}"
}
```

## Observações
- **ALERTA DE SEGURANÇA:** Esta rota é **pública e não possui nenhum tipo de autenticação (`GetSessionServer`)**. Isso significa que qualquer pessoa com acesso à URL da API pode tentar excluir arquivos do servidor de suporte, representando um risco de segurança significativo. Recomenda-se fortemente a implementação de um mecanismo de autenticação e autorização.

## Arquivo
- `src/app/api/suporte/delete/route.ts`
