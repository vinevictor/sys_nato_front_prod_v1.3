# API /chamado/put/[id]

## Finalidade
Rota responsável por atualizar um chamado de suporte específico, identificado pelo seu ID, enviando as alterações para o backend Strapi e garantindo autenticação do usuário.

## Método
- **PATCH**

## Fluxo
1. Recebe o parâmetro `id` na URL e os dados atualizados no body da requisição (JSON).
2. Verifica a sessão do usuário autenticado (`GetSessionServer`).
3. Envia requisição PATCH para a API do Strapi `/chamado/atualizar/{id}` com token de autenticação.
4. Retorna o resultado da atualização.
5. Em caso de erro, retorna mensagem e status apropriados.

## Exemplo de Request
```
PATCH /api/chamado/put/123
{
  "descricao": "Atualização do chamado..."
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Chamado atualizado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Erro ao atualizar chamado"
}
```

## Observações
- **Inconsistência de Método:** A rota está no diretório `put`, mas o método HTTP implementado é `PATCH`. Isso pode ser confuso e deve ser padronizado.
- **Inconsistência de Cache:** A rota não invalida nenhuma tag de cache (`revalidateTag`) após a atualização, o que pode levar a dados desatualizados na interface.
- **Inconsistência de Permissão:** A rota não verifica uma permissão de `role` específica, permitindo que qualquer usuário autenticado atualize um chamado, o que pode ser uma falha de segurança.
- Apenas usuários autenticados podem atualizar chamados.
- Retorna status HTTP 200 (sucesso), 401 (não autorizado) ou 500 (erro interno).

## Arquivo
- `src/app/api/chamado/put/[id]/route.ts`
