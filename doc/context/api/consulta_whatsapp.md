# API /consulta/whatsapp

## Finalidade
Rota para verificar a existência de um número de telefone na base de dados interna do sistema.

## Método
- **POST**

## Fluxo
1.  Recebe o `telefone` no corpo (body) da requisição em formato JSON.
2.  Verifica a sessão do usuário autenticado (`GetSessionServer`).
3.  Se autenticado, envia uma requisição `GET` para a API do Strapi no endpoint `/checktel/{telefone}`.
4.  Retorna a resposta da API do Strapi, que provavelmente indica se o telefone já está em uso.
5.  Em caso de falha na autenticação ou erro na API, retorna uma mensagem e o status de erro apropriado.

## Exemplo de Request
```json
POST /api/consulta/whatsapp
{
  "telefone": "5511999998888"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "data": {
    "exists": true,
    "message": "Telefone já cadastrado"
  }
}
```

## Observações
- A rota exige que o usuário esteja autenticado. Retorna `401 Unauthorized` caso contrário.
- **Inconsistência de Nomenclatura:** A rota é nomeada `/whatsapp`, mas o endpoint do backend é `/checktel`, indicando uma verificação de telefone genérica, não necessariamente específica do WhatsApp. Seria mais claro renomear a rota para `/consulta/telefone`.
- **Inconsistência de Método:** A rota da API Next.js usa o método `POST` para receber o telefone no corpo da requisição, mas a chamada para o backend Strapi é feita com o método `GET`, passando o telefone na URL. Isso é uma prática comum para evitar que dados sensíveis (como um telefone) fiquem expostos em logs de servidor ou no histórico do navegador se fossem passados como parâmetro de URL na requisição do cliente.

## Arquivo
- `src/app/api/consulta/whatsapp/route.ts`
