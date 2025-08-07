# API /bug_report

## Finalidade
Rota responsável por buscar todos os relatórios de bug (bug reports) cadastrados no sistema.

## Método
- **GET**

## Fluxo
1.  Recebe a requisição GET.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição GET para a API do Strapi no endpoint `/bug`.
4.  A requisição utiliza caching com revalidação a cada 1 hora (`revalidate: 60 * 60`) e a tag `bug-report-all`.
5.  Retorna a lista de relatórios de bug.
6.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```http
GET /api/bug_report
```

## Exemplo de Response
- **Sucesso:**
```json
[
  {
    "id": 1,
    "attributes": { 
      "titulo": "Botão de salvar não funciona",
      "descricao": "Ao clicar no botão salvar na tela de perfil, nada acontece."
    }
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
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- Utiliza caching do Next.js para otimizar o desempenho.

## Arquivo
- `src/app/api/bug_report/route.ts`
