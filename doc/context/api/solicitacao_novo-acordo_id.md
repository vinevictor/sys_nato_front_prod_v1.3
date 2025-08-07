# API /solicitacao/novo-acordo/[id]

## Finalidade
Rota responsável por registrar um "novo acordo" para uma `solicitacao` específica, identificada pelo seu ID. Esta ação provavelmente altera o status da solicitação no sistema para refletir o novo acordo.

## Método
- **PUT**

## Fluxo
1.  Recebe o `id` da solicitação na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `PUT` para a API do Strapi no endpoint `/solicitacao/novo_acordo/{id}`.
4.  A requisição não envia um corpo (body), agindo como um gatilho para a mudança de estado no backend.
5.  Retorna a resposta da API do Strapi, que deve conter os dados da solicitação com seu novo status.
6.  Em caso de falha, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
PUT /api/solicitacao/novo-acordo/250
```
(Não há corpo na requisição)

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 250,
  "attributes": {
    "status": "novo_acordo_firmado"
    // ... outros dados da solicitação atualizada
  }
}
```
- **Erro:**
```json
{
  "error": true,
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- Similar a outras rotas de mudança de estado, a ausência de um corpo na requisição `PUT` indica que a própria chamada ao endpoint é a ação desejada.
- A rota é marcada como `force-dynamic`, então não há cache envolvido.
- Há uma pequena inconsistência de nomenclatura entre a rota do Next.js (`novo-acordo`) e o endpoint do Strapi (`novo_acordo`).

## Arquivo
- `src/app/api/solicitacao/novo-acordo/[id]/route.ts`
