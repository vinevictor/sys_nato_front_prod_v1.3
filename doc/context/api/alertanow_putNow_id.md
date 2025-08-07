# API /alertanow/putNow/[id]

## Finalidade
Rota responsável por atualizar o status ou os dados de um alerta "agora" (now) específico, identificado pelo seu ID.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` do alerta na URL e os dados para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/now/{id}` com os novos dados.
4.  Após a atualização bem-sucedida, invalida o cache do Next.js para as tags `alertanow-list` and `alertanow-list-cont` para garantir que a lista e a contagem de alertas sejam atualizadas na próxima requisição.
5.  Retorna uma mensagem de sucesso e os dados atualizados.
6.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```json
PUT /api/alertanow/putNow/123
{
  "status": "Resolvido"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Alerta criado com sucesso",
  "data": {
    "response": { ... } // Dados do alerta atualizado
  }
}
```
- **Erro:**
```json
{
  "message": "Erro ao criar alerta!"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- **Excelente Prática de Cache:** A rota invalida corretamente duas tags de cache (`alertanow-list` e `alertanow-list-cont`) após a atualização. Isso garante que tanto a lista de alertas quanto a contagem exibida na interface sejam atualizadas simultaneamente, prevenindo inconsistências de dados e garantindo uma experiência de usuário coesa. É um ótimo exemplo de gerenciamento de cache.

## Arquivo
- `src/app/api/alertanow/putNow/[id]/route.ts`
