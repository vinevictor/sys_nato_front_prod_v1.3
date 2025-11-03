# API /adm/update/[id]

## Finalidade
Rota responsável por atualizar um registro de solicitação específico, identificado pelo seu ID. Embora esteja no diretório `adm`, a rota atua sobre a entidade `solicitacao`.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` da solicitação na URL e os dados para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se o usuário estiver autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/solicitacao/update/{id}` com os novos dados.
4.  Retorna uma mensagem de sucesso junto com a resposta do backend.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status apropriado.

## Exemplo de Request
```json
PUT /api/adm/update/123
{
  "status": "Concluído",
  "observacao": "Solicitação finalizada pelo administrador."
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "error": false,
  "message": "Registro criado com sucesso",
  "data": {
    "response": { ... } // Dados da solicitação atualizada
  }
}
```
- **Erro:**
```json
{
  "message": "Usuário não autenticado"
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- A lógica de atualização é delegada ao backend Strapi.
- **Inconsistência de Cache:** A rota modifica dados, mas não invalida nenhuma tag de cache (`revalidateTag`). Isso pode fazer com que a interface exiba dados desatualizados após uma atualização.
- **Inconsistência de Nomenclatura:** A rota está localizada em `/adm/update/[id]`, mas sua função específica é atualizar uma `solicitacao`. Uma localização mais descritiva, como `/solicitacao/update/[id]`, evitaria ambiguidades e melhoraria a organização da API.

## Arquivo
- `src/app/api/adm/update/[id]/route.ts`
