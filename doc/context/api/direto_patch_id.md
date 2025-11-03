# API /direto/patch/[id]

## Finalidade
Rota responsável por atualizar parcialmente (PATCH) um registro "direto" específico, identificado pelo seu ID.

## Método
- **PATCH**

## Fluxo
1.  Recebe o `id` do registro na URL e os dados para atualização no corpo (body) da requisição.
2.  Verifica a sessão do usuário autenticado (`GetSessionServerApi`).
3.  Se autenticado, envia uma requisição `PATCH` para a API do Strapi no endpoint `/direto/{id}` com os novos dados.
4.  A requisição utiliza caching (`force-cache`) com revalidação a cada 10 minutos (`revalidate: 60 * 10`).
5.  Tenta parsear a resposta do backend como JSON. Se falhar, trata como texto plano.
6.  Retorna a resposta da API do Strapi.
7.  Em caso de falha, retorna a mensagem e o status de erro apropriado.

## Exemplo de Request
```json
PATCH /api/direto/patch/15
{
  "status": "revisado"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "id": 15,
  "attributes": {
    "nome": "Registro Direto 15",
    "status": "revisado"
    // ... outros dados do registro
  }
}
```
- **Erro:**
```json
{
  "message": "Unauthorized"
}
```

## Observações
- A rota exige que o usuário esteja autenticado.
- Utiliza o método `PATCH`, que é semanticamente correto para atualizações parciais de um recurso.
- **Uso Incorreto de Cache:** A implementação utiliza `cache: 'force-cache'` e `revalidate` em uma requisição `PATCH`. Esta é uma prática incorreta, pois mecanismos de cache são projetados para otimizar operações de leitura (GET) e não de escrita. Aplicar cache em uma operação que modifica dados não tem efeito prático ou pode causar comportamentos inesperados. O ideal seria invalidar o cache (`revalidateTag`) após a atualização.
- O tratamento de erro para a resposta do backend é robusto, conseguindo lidar tanto com respostas JSON quanto com texto plano.

## Arquivo
- `src/app/api/direto/patch/[id]/route.ts`
