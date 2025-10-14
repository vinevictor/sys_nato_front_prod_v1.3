# Select Dependente: UF e Cidade

## 📋 Visão Geral

Implementação de **selects dependentes** onde o select de **Cidade** é filtrado baseado no **Estado (UF)** selecionado.

---

## 🏗️ Arquitetura

### **Fluxo de Dados:**

```
┌──────────────────────────────────────────────────────────┐
│  CardUpdateEmpreendimento (Server Component)             │
│  - Não gerencia estado                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
         ┌───────────────▼───────────────────┐
         │  EmpreendimentoUfCidadeGroup      │
         │  (Client Component)                │
         │  - Gerencia estado: ufSelecionada  │
         └────────┬───────────────┬───────────┘
                  │               │
         ┌────────▼────────┐  ┌──▼──────────────┐
         │ GridUf          │  │ GridCidade       │
         │ - onUfChange()  │  │ - ufValue prop   │
         └────────┬────────┘  └──┬───────────────┘
                  │               │
         ┌────────▼────────┐  ┌──▼──────────────┐
         │ InputUf         │  │ InputCidade      │
         │ - Select UF     │  │ - Select Cidade  │
         │ - API estados   │  │ - API cidades    │
         └─────────────────┘  └──────────────────┘
```

---

## 📁 Arquivos Modificados/Criados

### **1. Componente UF e Cidade (Novo)** ✅
**Arquivo:** `/src/components/card_EditarEmpreendimento/EmpreendimentoUfCidadeGroup.tsx`

**Tipo:** Client Component ("use client")

**Responsabilidade:**
- Gerencia o estado compartilhado entre UF e Cidade
- Permite que o CardUpdateEmpreendimento seja Server Component

**Props:**
```typescript
interface EmpreendimentoUfCidadeGroupProps {
  uf?: string;           // Valor inicial da UF
  cidade?: string;       // Valor inicial da cidade
  id?: number;           // ID do empreendimento
  ufWidth?: string;      // Largura do campo UF
  cidadeWidth?: string;  // Largura do campo Cidade
}
```

**Funcionalidade:**
```typescript
const [ufSelecionada, setUfSelecionada] = useState(uf);

const handleUfChange = (novaUf: string) => {
  setUfSelecionada(novaUf);
};

// Renderiza GridUf e GridCidade com estado compartilhado
```

---

### **2. API de Cidades** ✅
**Arquivo:** `/src/app/api/country/cidades/route.ts`

```typescript
GET /api/country/cidades?state=SP
```

**Funcionalidade:**
- Retorna cidades filtradas por UF
- Lê arquivo `cities.json`
- Ordena cidades alfabeticamente

---

### **3. Input de Cidade** ✅
**Arquivo:** `/src/implementes/cardCreateUpdate/imputs/inputEmpreendimentoCidade.tsx`

**Antes:** Input de texto  
**Depois:** Select dependente da UF

**Props:**
```typescript
interface InputEmpreendimentoCidadeProps {
  setCidadeValue?: string;  // Valor inicial
  ufValue?: string;         // UF para filtrar (NOVO)
  onChange?: (e) => void;   // Callback de mudança
}
```

**Estados:**
- ✅ **Loading:** Skeleton enquanto busca cidades
- ✅ **Sem UF:** Select desabilitado com placeholder
- ✅ **Com UF:** Select com cidades ordenadas
- ✅ **Erro:** Mensagem de erro

---

### **4. Grid de Cidade** ✅
**Arquivo:** `/src/implementes/cardCreateUpdate/Grid/CardGridEmpreendimentoCidade.tsx`

**Props Adicionadas:**
```typescript
interface CardGridEmpreendimentoCidadeProps {
  cidade?: string;
  ufValue?: string;  // NOVO - Recebe a UF selecionada
}
```

---

### **5. Grid de UF** ✅
**Arquivo:** `/src/implementes/cardCreateUpdate/Grid/CardGridEmpreendimentoUf.tsx`

**Props Adicionadas:**
```typescript
interface CardGridEmpreendimentoUfProps {
  uf?: string;
  id?: number;
  onUfChange?: (uf: string) => void;  // NOVO - Callback
}
```

**Funcionalidade:**
- Notifica o componente pai quando UF muda
- Permite reatividade do select de cidades

---

### **6. Componente Pai** ✅
**Arquivo:** `/src/components/card_EditarEmpreendimento/index.tsx`

**Tipo:** Server Component

**Mudanças:**
```typescript
// ANTES - Era Client Component com estado
"use client";
const [ufSelecionada, setUfSelecionada] = useState(estado);

// DEPOIS - Server Component, usa componente cliente
import EmpreendimentoUfCidadeGroup from "./EmpreendimentoUfCidadeGroup";

<EmpreendimentoUfCidadeGroup
  uf={setEmpreendimentoCard.estado ?? ""}
  cidade={setEmpreendimentoCard.cidade ?? ""}
  id={id}
  ufWidth="3rem"
  cidadeWidth="15rem"
/>
```

---

## 🔄 Fluxo de Funcionamento

### **1. Carregamento Inicial**
```
1. Componente monta
2. Estado inicial: ufSelecionada = empreendimento.estado
3. GridUf renderiza com valor inicial
4. GridCidade recebe ufValue e busca cidades
```

### **2. Mudança de UF**
```
1. Usuário seleciona nova UF
2. GridUf chama onUfChange(novaUf)
3. CardUpdateEmpreendimento atualiza ufSelecionada
4. GridCidade recebe novo ufValue
5. InputCidade detecta mudança e busca novas cidades
6. Select de cidade atualiza com novas opções
```

### **3. Busca de Cidades**
```typescript
// InputCidade useEffect
useEffect(() => {
  if (ufValue) {
    fetchCidades(ufValue);  // Busca cidades da UF
  } else {
    setCidades([]);         // Limpa cidades
  }
}, [ufValue]);
```

---

## 🎨 Estados Visuais

### **Select de Cidade - Sem UF**
```jsx
<Select isDisabled placeholder="Selecione primeiro um estado" />
```

### **Select de Cidade - Loading**
```jsx
<Skeleton height="40px" width="100%" />
```

### **Select de Cidade - Com Dados**
```jsx
<Select placeholder="Selecione uma cidade">
  <option value="São Paulo">São Paulo</option>
  <option value="Campinas">Campinas</option>
  ...
</Select>
```

### **Select de Cidade - Erro**
```jsx
<Box bg="red.50">
  <Text color="red.600">Erro ao carregar cidades</Text>
</Box>
```

---

## 📊 Interface de Dados

### **Estado (UF)**
```typescript
interface Estado {
  id: number;
  name: string;
  iso2: string;      // "SP", "RJ", "MG"
  iso3166_2: string;
  country_code: string;
  country_name: string;
}
```

### **Cidade**
```typescript
interface Cidade {
  id: number;
  name: string;
  state_code: string;     // "SP" (filtro)
  state_name: string;
  country_code: string;
  latitude: string;
  longitude: string;
}
```

---

## 🔧 API Endpoints

### **Estados**
```
GET /api/country/estados
Response: { ok: true, data: Estado[], total: number }
```

### **Cidades**
```
GET /api/country/cidades?state=SP
Response: { ok: true, data: Cidade[], total: number }
```

---

## ✅ Funcionalidades Implementadas

- ✅ Select de UF busca estados do Brasil
- ✅ Select de Cidade busca cidades por UF
- ✅ Skeleton durante carregamento
- ✅ Select de cidade desabilitado sem UF
- ✅ Ordenação alfabética de estados e cidades
- ✅ Tratamento de erro
- ✅ Dark mode em todos os estados
- ✅ Responsividade (width: 100%, minW: 200px)
- ✅ Valores iniciais preservados
- ✅ Estados compartilhados entre componentes
- ✅ Callbacks para reatividade

---

## 🎯 Boas Práticas Aplicadas

1. **Single Responsibility:** Cada componente tem uma responsabilidade
2. **Composição:** Componentes Grid compõem Inputs
3. **Estado Compartilhado:** Gerenciado no componente pai
4. **Callbacks:** Comunicação entre componentes
5. **Loading States:** Feedback visual durante carregamento
6. **Error Handling:** Tratamento de erros da API
7. **Acessibilidade:** Placeholders descritivos
8. **TypeScript:** Interfaces bem definidas
9. **Comentários:** Funções documentadas com JSDoc

---

## 🚀 Como Usar

### **Opção 1: Com Componente Wrapper (Recomendado para Server Components)**

```tsx
// Server Component
import EmpreendimentoUfCidadeGroup from "./EmpreendimentoUfCidadeGroup";

<Form>
  <EmpreendimentoUfCidadeGroup
    uf={empreendimento.estado}
    cidade={empreendimento.cidade}
    id={empreendimento.id}
    ufWidth="3rem"
    cidadeWidth="15rem"
  />
</Form>
```

### **Opção 2: Com Estado Próprio (Client Components)**

```tsx
"use client";
const [ufSelecionada, setUfSelecionada] = useState("");

<Form>
  <GridEmpreendimentoUf
    uf={uf}
    onUfChange={setUfSelecionada}
  />
  
  <GridEmpreendimentoCidade
    cidade={cidade}
    ufValue={ufSelecionada}
  />
</Form>
```

### **Valores Enviados:**

```
empreendimentoUf: "SP"
nomeCidade: "São Paulo"
```

---

## 🔀 Server vs Client Components

### **Por que EmpreendimentoUfCidadeGroup?**

O Next.js 14 App Router prioriza **Server Components** por padrão, que:
- ✅ Renderizam no servidor
- ✅ Reduzem o bundle JavaScript
- ✅ Melhoram a performance
- ❌ Não podem usar hooks (useState, useEffect)

### **Problema:**
```typescript
// ❌ Não funciona em Server Component
export function CardUpdateEmpreendimento() {
  const [ufSelecionada, setUfSelecionada] = useState(""); // ERRO!
  ...
}
```

### **Solução:**
Separar a lógica de estado em um **Client Component** dedicado:

```typescript
// ✅ Server Component (CardUpdateEmpreendimento)
export function CardUpdateEmpreendimento() {
  return (
    <Form>
      {/* Client Component encapsulado */}
      <EmpreendimentoUfCidadeGroup ... />
    </Form>
  );
}

// ✅ Client Component (EmpreendimentoUfCidadeGroup)
"use client";
export default function EmpreendimentoUfCidadeGroup() {
  const [ufSelecionada, setUfSelecionada] = useState(""); // OK!
  ...
}
```

### **Benefícios:**
- ✅ Mantém CardUpdateEmpreendimento como Server Component
- ✅ Estado isolado apenas onde necessário
- ✅ Menor bundle JavaScript no cliente
- ✅ Melhor performance geral

---

## 🐛 Tratamento de Erros

### **Erros Possíveis:**

1. **API indisponível:** Mostra mensagem de erro
2. **UF não selecionada:** Select desabilitado
3. **Sem cidades:** Lista vazia
4. **Falha na busca:** Mensagem de erro

### **Logs:**

```typescript
console.log("🚀 ~ fetchEstados ~ result:", result)
console.error("❌ Erro ao buscar cidades:", err)
```

---

## 📝 Próximas Melhorias

- [ ] Cache de cidades já buscadas
- [ ] Debounce na busca (se necessário)
- [ ] Paginação para muitas cidades
- [ ] Busca/filtro no select
- [ ] Retry automático em caso de erro
- [ ] Indicador de quantidade de cidades

---

**Implementado em:** 14/10/2025  
**Status:** ✅ Completo e Funcional
