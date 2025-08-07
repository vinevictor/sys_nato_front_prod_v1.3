# API /alerts/solicitacao/[id]

## Finalidade
Rota responsável por buscar os alertas associados a um cadastro de solicitação específico, identificado pelo seu ID.

## Método
- **GET**

## Fluxo
1.  Recebe o `id` do cadastro (solicitação) na URL.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/alert/get/cadastro/{id}`.
4.  Retorna a lista de alertas relacionados àquela solicitação.
5.  Em caso de falha na autenticação ou se a solicitação não for encontrada, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/alerts/solicitacao/123
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 5,
    "attributes": { 
      "titulo": "Alerta de Pendência Documental",
      "mensagem": "Falta o documento X para a solicitação 123."
    }
  }
]
```
- **Não Encontrado:**
```json
{
  "message": "Solicitação não encontrada"
}
```

## Observações
- **FALHA DE SEGURANÇA (AUSÊNCIA DE RBAC):** Ao contrário de outras rotas no módulo `alerts`, esta rota apenas verifica a autenticação do usuário, mas **não** valida se ele possui a permissão específica (`role.alert`). Isso cria uma vulnerabilidade, permitindo que qualquer usuário autenticado acesse alertas que deveriam ser restritos, quebrando o modelo de permissões do sistema.
- **FALHA DE ARQUITETURA (AUSÊNCIA DE CACHE):** A rota não implementa nenhuma estratégia de cache (como `revalidate` ou `tags`). Isso é inconsistente com outras rotas `GET` do mesmo módulo e pode levar a um excesso de requisições ao backend, resultando em performance degradada e sobrecarga desnecessária.

## Arquivo
- `src/app/api/alerts/solicitacao/[id]/route.ts`
