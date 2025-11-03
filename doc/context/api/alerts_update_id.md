# API /alerts/update/[id]

## Finalidade
Rota responsável por atualizar um alerta específico, identificado pelo seu ID.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` do alerta na URL e os dados para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/alert/update/{id}` com os novos dados.
4.  Retorna a resposta da API do Strapi, que contém o alerta atualizado.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PUT /api/alerts/update/10
{
  "lido": true,
  "mensagem": "Alerta lido e arquivado."
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 10,
  "attributes": {
    "lido": true,
    "mensagem": "Alerta lido e arquivado.",
    // ... outros campos do alerta
  }
}
```
- **Erro:**
```json
{
  "message": "Erro ao atualizar o alerta"
}
```

## Observações
- **FALHA DE SEGURANÇA CRÍTICA (AUSÊNCIA DE RBAC):** Esta rota permite que **qualquer usuário autenticado modifique qualquer alerta**. Ao contrário das rotas `create` e `delete`, ela não verifica a permissão `role.alert`. Isso representa uma vulnerabilidade grave, pois usuários sem privilégios podem alterar informações críticas do sistema.
- **FALHA DE ARQUITETURA CRÍTICA (AUSÊNCIA DE INVALIDAÇÃO DE CACHE):** A rota modifica dados (`PUT`), mas **não invalida a tag de cache `alert-geral-all`**. Isso fará com que as listas de alertas na interface do usuário permaneçam desatualizadas após uma modificação, mostrando dados incorretos (stale data) até que o cache expire.
- **Bug Potencial no Tratamento de Erros:** O bloco `catch` repete o bug de tentar usar `.join()` em uma string de mensagem de erro.

## Arquivo
- `src/app/api/alerts/update/[id]/route.ts`
