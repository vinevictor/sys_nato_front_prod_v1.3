# API - Busca de Dados por CNPJ

## Finalidade
Fornecer endpoint para buscar dados de empresas brasileiras através do CNPJ utilizando API pública da Receita Federal.

## Endpoint
```
GET /api/cnpj/[cnpj]
```

## Arquivo
`src/app/api/cnpj/[cnpj]/route.ts`

## Parâmetros

### Path Parameters
- `cnpj` (string, obrigatório): CNPJ da empresa (apenas números, 14 dígitos)

### Exemplo de Request
```
GET /api/cnpj/12345678000190
```

## Integração Externa

### API Utilizada
- **URL:** `https://publica.cnpj.ws/cnpj/{cnpj}`
- **Método:** GET
- **Documentação:** [CNPJ.WS](https://publica.cnpj.ws)
- **Gratuita:** Sim
- **Limite:** Sem autenticação

### Dados Retornados pela API Externa
```json
{
  "razao_social": "EMPRESA EXEMPLO LTDA",
  "estabelecimento": {
    "nome_fantasia": "EXEMPLO",
    "email": "contato@exemplo.com",
    "ddd1": "11",
    "telefone1": "987654321"
  }
}
```

## Response

### Sucesso (200)
```json
{
  "razaosocial": "EMPRESA EXEMPLO LTDA",
  "nomefantasia": "EXEMPLO",
  "email": "contato@exemplo.com",
  "telefone": "11987654321"
}
```

### CNPJ Não Encontrado (404)
```json
{
  "message": "CNPJ não encontrado"
}
```

### Erro no Servidor (500)
```json
{
  "message": "Erro ao buscar dados do CNPJ"
}
```

## Lógica de Processamento

### 1. Recebimento
```typescript
const cnpj = params.cnpj; // Ex: "12345678000190"
```

### 2. Requisição à API Externa
```typescript
const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`, {
  cache: "no-store", // Sempre busca dados atualizados
});
```

### 3. Validação da Resposta
```typescript
if (data.error || !data.razao_social) {
  return NextResponse.json(
    { message: "CNPJ não encontrado" },
    { status: 404 }
  );
}
```

### 4. Formatação dos Dados
- **razaosocial:** Razão social completa ou string vazia
- **nomefantasia:** Nome fantasia do estabelecimento ou string vazia
- **email:** Email do estabelecimento ou string vazia
- **telefone:** Concatenação de DDD + telefone ou string vazia

```typescript
const result = {
  razaosocial: data.razao_social || "",
  nomefantasia: data.estabelecimento?.nome_fantasia || "",
  email: data.estabelecimento?.email || "",
  telefone: data.estabelecimento?.telefone1
    ? `${data.estabelecimento.ddd1}${data.estabelecimento.telefone1}`
    : "",
};
```

### 5. Retorno
```typescript
return NextResponse.json(result);
```

## Uso no Frontend

### Componente
`src/components/financeirasCard/form/index.tsx`

### Função
```typescript
const handleSearchCNPJ = async () => {
  const cnpjSemMascara = form.cnpj.replace(/\D/g, "");
  
  // Validação
  if (cnpjSemMascara.length !== 14) {
    toast({ title: "CNPJ inválido", status: "warning" });
    return;
  }

  // Busca
  const req = await fetch(`/api/cnpj/${cnpjSemMascara}`);
  const data = await req.json();

  // Preenche formulário
  setForm(prev => ({
    ...prev,
    razaosocial: data.razaosocial,
    fantasia: data.nomefantasia,
    email: data.email,
    tel: data.telefone,
  }));
};
```

### Integração no Formulário
- **Botão:** InputRightElement no campo CNPJ
- **Ícone:** MdSearch (lupa)
- **Loading:** isSearchingCNPJ state
- **Validação:** Desabilitado se CNPJ < 14 dígitos
- **Feedback:** Toast de sucesso/erro

## Cache
```typescript
cache: "no-store"
```
- Sempre busca dados atualizados da API externa
- Não armazena em cache do Next.js
- Garante informações recentes

## Tratamento de Erros

### Casos de Erro
1. **CNPJ não existe:** Retorna 404 com mensagem
2. **API externa fora:** Captura em try/catch, retorna 500
3. **Timeout:** Tratado pelo fetch
4. **Dados inválidos:** Validação de `razao_social`

### Error Handling
```typescript
try {
  // ... lógica
} catch (error) {
  return NextResponse.json(
    {
      message: error instanceof Error 
        ? error.message 
        : "Erro ao buscar dados do CNPJ",
    },
    { status: 500 }
  );
}
```

## Segurança

### Validações
- CNPJ deve ter 14 dígitos (validado no frontend)
- Dados sanitizados (apenas números)
- Sem armazenamento de dados sensíveis

### Limitações
- Depende de API pública (sem SLA)
- Possível rate limit da API externa
- Sem autenticação necessária

## Performance

### Considerações
- Request síncrono (aguarda resposta)
- Timeout padrão do fetch
- Cache desabilitado (dados sempre atuais)
- Loading state para UX

## Melhorias Futuras
1. Implementar cache com TTL (ex: 24h)
2. Fallback para API alternativa
3. Rate limiting interno
4. Fila de requisições
5. Retry automático em caso de falha

## Dependências
- Next.js (NextRequest, NextResponse)
- API Externa: publica.cnpj.ws
- TypeScript

## Exemplo de Uso Completo

### Frontend
```typescript
// 1. Usuário digita CNPJ
<Input value="12.345.678/0001-90" />

// 2. Clica no botão de busca
<IconButton onClick={handleSearchCNPJ} />

// 3. Sistema busca
await fetch('/api/cnpj/12345678000190')

// 4. Preenche campos
setForm({
  razaosocial: "EMPRESA EXEMPLO LTDA",
  fantasia: "EXEMPLO",
  email: "contato@exemplo.com",
  tel: "11987654321"
})
```

### Backend
```typescript
// 1. Recebe requisição
GET /api/cnpj/12345678000190

// 2. Busca na API externa
fetch('https://publica.cnpj.ws/cnpj/12345678000190')

// 3. Formata resposta
return { razaosocial, nomefantasia, email, telefone }

// 4. Frontend recebe e preenche
```

## Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso - CNPJ encontrado |
| 404 | CNPJ não encontrado |
| 500 | Erro no servidor ou API externa |

## Links Relacionados
- **Formulário:** `src/components/financeirasCard/form/index.tsx`
- **Documentação Financeiras:** `../frontend_ADM_FINANCEIRAS.md`
- **API Externa:** https://publica.cnpj.ws
