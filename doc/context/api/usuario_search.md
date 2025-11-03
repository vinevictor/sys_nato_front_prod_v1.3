# API /usuario/search

## Finalidade
Rota responsável por buscar e filtrar usuários com base em múltiplos parâmetros de consulta.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição `GET` com parâmetros de consulta na URL (ex: `?nome=joao&email=...`).
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Constrói uma string de consulta com base nos parâmetros recebidos.
4.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/user/Busca` com os parâmetros.
5.  Recebe a lista de usuários do backend.
6.  **Filtra os resultados no servidor Next.js para remover usuários com `hierarquia` igual a "ADM".**
7.  **Invalida a tag de cache `usuarios_list` a cada busca.**
8.  Retorna a lista de usuários filtrada.

## Exemplo de Request
```http
GET /api/usuario/search?nome=Joao&email=joao@exemplo.com
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 123,
    "username": "Joao.Silva",
    "email": "joao@exemplo.com",
    "hierarquia": "Corretor"
  }
]
```
- **Erro:**
```json
{
  "message": "Invalid credentials"
}
```

## Observações
- **FALHA DE ARQUITETURA (CACHE):** A rota utiliza `revalidateTag("usuarios_list")` em uma requisição `GET`. Esta função serve para invalidar o cache após uma modificação de dados (em rotas `POST`, `PUT`, `DELETE`). Usá-la em uma rota de busca (`GET`) força a invalidação do cache a cada pesquisa, o que anula completamente os benefícios do cache em páginas de listagem, degrada a performance e aumenta a carga no servidor. Esta chamada deve ser removida imediatamente.
- **FALHA DE ARQUITETURA (LÓGICA DE NEGÓCIO):** A rota busca todos os usuários do backend e, em seguida, filtra para remover os administradores (`user.hierarquia !== "ADM"`) no servidor Next.js. Essa lógica de filtragem deve ser implementada no backend para evitar o tráfego de dados desnecessários e centralizar as regras de negócio.
- A rota exige que o usuário esteja autenticado.

## Arquivo
- `src/app/api/usuario/search/route.ts`
