# API /chamado/delete/[id]

## Finalidade
Rota responsável por excluir um chamado de suporte específico, identificado pelo seu ID, garantindo autenticação do usuário.

## Método
- **DELETE**

## Fluxo
1. Recebe o parâmetro `id` na URL.
2. Verifica a sessão do usuário autenticado (`GetSessionServer`).
3. Envia requisição DELETE para a API do Strapi `/chamado/{id}` com token de autenticação.
4. Retorna o resultado da exclusão.
5. Em caso de erro, retorna mensagem e status apropriados.

## Exemplo de Request
```
DELETE /api/chamado/delete/123
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Chamado deletado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Erro ao deletar chamado"
}
```

## Observações
- Apenas usuários autenticados podem excluir chamados.
- **Inconsistência de Cache:** A rota não invalida nenhuma tag de cache (`revalidateTag`) após a exclusão. Isso pode fazer com que a lista de chamados na interface do usuário permaneça desatualizada, mostrando um chamado que já foi removido.
- **Inconsistência de Permissão:** A rota não verifica uma permissão de `role` específica para a exclusão, permitindo que qualquer usuário autenticado delete um chamado. Isso pode ser uma falha de segurança se a intenção for restringir essa ação.
- Retorna status HTTP 200 (sucesso), 401 (não autorizado) ou 500 (erro interno).

## Arquivo
- `src/app/api/chamado/delete/[id]/route.ts`
