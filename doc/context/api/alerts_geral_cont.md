# API /alerts/geral/cont

## Finalidade
Rota responsável por obter a contagem total de alertas gerais no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Verifica se o usuário possui a permissão específica para ver alertas (`session.user?.role?.alert`). Se não tiver, retorna um array vazio (status 200).
4.  Se autenticado e autorizado, envia uma requisição GET para a API do Strapi no endpoint `/alert/cont`.
5.  A requisição utiliza caching com revalidação a cada 30 minutos e a tag `alert-geral-cont`.
6.  Retorna a contagem numérica de alertas.
7.  Em caso de falha, retorna uma mensagem de erro.

## Exemplo de Request
```http
GET /api/alerts/geral/cont
```

## Exemplo de Response
- **Sucesso:**
```json
5
```
- **Sem Permissão:**
```json
[]
```

## Observações
- A rota exige autenticação e uma permissão de role específica (`alert`).
- **Anomalia no Controle de Acesso:** Em caso de falha de permissão, a rota retorna um array vazio `[]` com status `200 OK`. Para uma rota que deve retornar um número (contagem), este comportamento é inesperado. O ideal seria retornar `0` ou, para ser semanticamente correto, um status `403 Forbidden` para indicar a falha de autorização.
- **Estrutura de Rota Incomum:** A rota está aninhada em `/geral/cont`. Uma estrutura mais clara e RESTful seria ter uma rota dedicada, como `/api/alerts/count`.
- **Bug Potencial no Tratamento de Erros:** O bloco `catch` repete o bug de tentar usar `.join()` em uma string de mensagem de erro, o que pode causar uma falha na execução.

## Arquivo
- `src/app/api/alerts/geral/cont/route.ts`
