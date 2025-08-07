# API /auth

## Finalidade
Rota responsável pela autenticação de usuários. Realiza o login, valida credenciais junto ao backend Strapi e cria sessões seguras no frontend e backend.

## Método
- **POST**

## Fluxo
1. Recebe `username` e `password` no body da requisição.
2. Encaminha as credenciais para a API do Strapi (`/auth`).
3. Se as credenciais forem válidas:
   - Recebe `token` e dados do usuário.
   - Cria sessão no servidor (`CreateSessionServer`) e no cliente (`CreateSessionClient`).
   - Retorna mensagem de sucesso.
4. Se inválidas, retorna mensagem de erro.

## Exemplo de Request
```json
POST /api/auth
{
  "username": "usuario",
  "password": "senha"
}
```

## Exemplo de Response
- **Sucesso:**
```json
{
  "message": "Login realizado com sucesso"
}
```
- **Erro:**
```json
{
  "message": "Usuário ou senha inválidos"
}
```

## Observações
- Utiliza variáveis de ambiente para URL do backend.
- Sessão criada tanto no servidor quanto no cliente para segurança.
- Retorna status HTTP 200 (sucesso), 400 (erro de autenticação) ou 500 (erro interno).

## Arquivo
- `src/app/api/auth/route.ts`
