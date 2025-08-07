# API /alerts/geral/findAll

## Finalidade
Rota responsável por buscar todos os alertas gerais cadastrados no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Verifica se o usuário possui a permissão específica para ver alertas (`session.user?.role?.alert`). Se não tiver, retorna um array vazio (status 200).
4.  Se autenticado e autorizado, envia uma requisição GET para a API do Strapi no endpoint `/alert`.
5.  A requisição utiliza caching com revalidação a cada 30 minutos e a tag `alert-geral-all`.
6.  Retorna a lista de alertas.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/alerts/geral/findAll
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "attributes": { "titulo": "Alerta 1" }
  },
  {
    "id": 2,
    "attributes": { "titulo": "Alerta 2" }
  }
]
```
- **Sem Permissão:**
```json
[]
```

## Observações
- A rota exige autenticação e uma permissão de role específica (`alert`).
- **Anomalia no Controle de Acesso:** Em caso de falha de permissão, a rota retorna um array vazio `[]` com status `200 OK`. Este comportamento "silencioso" pode mascarar problemas de permissão. O ideal seria retornar um status `403 Forbidden` para indicar explicitamente a falha de autorização.
- **Estrutura de Rota Incomum:** O aninhamento em `/geral/findAll` é pouco intuitivo. O padrão RESTful para buscar todos os recursos de `alerts` seria simplesmente `GET /api/alerts`.
- **Bug Potencial no Tratamento de Erros:** O bloco `catch` repete o bug de tentar usar `.join()` em uma string de mensagem de erro, o que pode causar uma falha na execução.

## Arquivo
- `src/app/api/alerts/geral/findAll/route.ts`
