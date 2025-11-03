# API /chamado/post

## Finalidade
Rota responsável por criar novos chamados de suporte no sistema, enviando os dados para o backend Strapi e garantindo autenticação do usuário.

## Método
- **POST**

## Fluxo
1. Recebe dados do chamado em formato JSON no body da requisição.
2. Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3. Encaminha os dados para a API do Strapi `/chamado` via POST, incluindo o token de autenticação.
4. Retorna mensagem de sucesso e os dados do chamado criado.
5. Em caso de erro, retorna mensagem e status apropriados.

## Exemplo de Request
```json
POST /api/chamado/post
{
  "titulo": "Problema X",
  "descricao": "Detalhes do problema...",
  ...
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": { ... },
  "message": "Arquivo enviado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Descrição do erro"
}
```

## Observações
- Apenas usuários autenticados podem criar chamados (status 401 se não autenticado).
- **Inconsistência de Cache:** A rota não invalida nenhuma tag de cache (`revalidateTag`) após a criação de um novo chamado. Isso pode fazer com que a lista de chamados na interface do usuário não seja atualizada em tempo real.
- **Permissão Aberta:** A rota não verifica uma permissão de `role` específica, permitindo que qualquer usuário autenticado crie um chamado. Isso pode ser intencional, mas difere de outros módulos com controle de acesso mais granular.
- Utiliza variáveis de ambiente para URL do backend.
- Retorna status HTTP 200 (sucesso), 401 (não autorizado) ou 500 (erro interno).

## Arquivo
- `src/app/api/chamado/post/route.ts`
