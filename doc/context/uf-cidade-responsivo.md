# Layout Responsivo: UF e Cidade

## 📋 Visão Geral

Implementação de layout **responsivo** para os campos UF e Cidade, que se adaptam automaticamente ao tamanho da tela.

---

## 📱 Comportamento Responsivo

### **Mobile (< 768px):**
```
┌──────────────────────────┐
│ UF                       │
│ [Selecione um estado ▼] │
├──────────────────────────┤
│ Cidade                   │
│ [Selecione uma cidade ▼]│
└──────────────────────────┘
```
- **Layout:** Coluna (vertical)
- **Largura UF:** 100%
- **Largura Cidade:** 100%
- **Espaçamento:** 12px entre campos

### **Desktop (≥ 768px):**
```
┌──────────┬────────────────────────────┐
│    UF    │         Cidade             │
│  120px   │    (ocupa espaço restante) │
└──────────┴────────────────────────────┘
```
- **Layout:** Linha (horizontal)
- **Largura UF:** 120px (fixo)
- **Largura Cidade:** flex: 1 (flexível)
- **Espaçamento:** 12px entre campos

---

## 🔧 Implementação Técnica

### **Stack com Direction Responsivo:**

```tsx
<Stack
  direction={{ base: "column", md: "row" }}
  spacing={3}
  width="100%"
  align="stretch"
>
  <GridEmpreendimentoUf
    w={{ base: "100%", md: "120px" }}
  />
  
  <GridEmpreendimentoCidade
    w="100%"
    flex={{ base: "0", md: "1" }}
  />
</Stack>
```

### **Propriedades Responsivas:**

| Propriedade | Mobile (base) | Desktop (md) |
|-------------|---------------|--------------|
| **direction** | `column` | `row` |
| **UF width** | `100%` | `120px` |
| **Cidade flex** | `0` | `1` |
| **spacing** | `3` (12px) | `3` (12px) |
| **align** | `stretch` | `stretch` |

---

## 📊 Breakpoints

```typescript
{
  base: "0px",    // Mobile: 0px - 767px
  md: "768px",    // Desktop: 768px+
}
```

---

## 🎨 Comportamento Visual

### **Mobile:**
1. UF ocupa toda largura
2. Cidade ocupa toda largura
3. Empilhados verticalmente
4. Fácil de tocar em telas pequenas

### **Desktop:**
1. UF tem largura fixa (120px)
2. Cidade expande para preencher o resto
3. Alinhados horizontalmente
4. Usa o espaço horizontal eficientemente

---

## ✨ Vantagens

✅ **Responsivo:** Adapta-se automaticamente  
✅ **Mobile-first:** Prioriza dispositivos móveis  
✅ **Flexível:** Cidade expande no desktop  
✅ **Consistente:** Espaçamento uniforme  
✅ **Acessível:** Fácil de usar em qualquer tela  
✅ **Performático:** Usa Chakra UI otimizado  

---

## 🔄 Fluxo de Renderização

### **Mobile (< 768px):**
```
Stack (direction: column)
  ↓
┌─────────────────┐
│ GridUf (100%)   │
├─────────────────┤
│ GridCidade(100%)│
└─────────────────┘
```

### **Desktop (≥ 768px):**
```
Stack (direction: row)
  ↓
┌──────┬──────────────────┐
│ UF   │ Cidade (flex: 1) │
│120px │                  │
└──────┴──────────────────┘
```

---

## 🎯 Código Completo

```tsx
"use client";
import React, { useState } from "react";
import { Stack } from "@chakra-ui/react";
import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";

export default function EmpreendimentoUfCidadeGroup({
  uf,
  cidade,
  id,
  ufWidth = "120px",
  cidadeWidth = "100%",
}: EmpreendimentoUfCidadeGroupProps) {
  const [ufSelecionada, setUfSelecionada] = useState<string>(uf ?? "");

  const handleUfChange = (novaUf: string) => {
    setUfSelecionada(novaUf);
  };

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={3}
      width="100%"
      align="stretch"
    >
      {/* UF: 100% mobile, 120px desktop */}
      <CardCreateUpdate.GridEmpreendimentoUf
        uf={uf}
        id={id}
        w={{ base: "100%", md: ufWidth }}
        onUfChange={handleUfChange}
      />

      {/* Cidade: 100% sempre, flex: 1 no desktop */}
      <CardCreateUpdate.GridEmpreendimentoCidade
        cidade={cidade}
        ufValue={ufSelecionada}
        w="100%"
        flex={{ base: "0", md: "1" }}
      />
    </Stack>
  );
}
```

---

## 📐 Props com Valores Padrão

```typescript
interface EmpreendimentoUfCidadeGroupProps {
  uf?: string;
  cidade?: string;
  id?: number;
  ufWidth?: string;      // Padrão: "120px"
  cidadeWidth?: string;  // Padrão: "100%" (ignorado, usa flex)
}
```

**Nota:** No desktop, a `cidadeWidth` é sobrescrita por `flex: 1` para ocupar o espaço restante.

---

## 🔍 Teste de Responsividade

### **Como Testar:**

1. **Mobile:** Redimensione a janela para < 768px
   - ✅ Campos devem ficar em coluna
   - ✅ Ambos devem ter 100% de largura

2. **Desktop:** Redimensione a janela para ≥ 768px
   - ✅ Campos devem ficar em linha
   - ✅ UF deve ter 120px
   - ✅ Cidade deve expandir

3. **Transição:** Redimensione entre mobile e desktop
   - ✅ Transição deve ser suave
   - ✅ Sem quebras de layout

---

## 🎨 Dark Mode

Ambos os componentes suportam dark mode automaticamente:

```tsx
<Select
  _dark={{
    bg: "gray.700",
    borderColor: "gray.600",
    color: "gray.100",
  }}
>
```

---

## 📱 Comparação Visual

### **Antes (Sempre Horizontal):**
```
❌ Mobile: Campos espremidos lado a lado
❌ Desktop: UF muito pequeno, Cidade muito grande
```

### **Depois (Responsivo):**
```
✅ Mobile: Campos empilhados, fácil de usar
✅ Desktop: UF tamanho adequado, Cidade flexível
```

---

## 🚀 Performance

- **Sem JavaScript adicional:** Usa apenas CSS responsivo
- **Renderização otimizada:** Chakra UI otimiza automaticamente
- **Sem re-renders:** Mudança de breakpoint é CSS puro
- **Bundle pequeno:** Stack é leve (~2KB)

---

## 📚 Referências

- [Chakra UI Stack](https://chakra-ui.com/docs/components/stack)
- [Chakra UI Responsive Styles](https://chakra-ui.com/docs/styled-system/responsive-styles)
- [Mobile-First Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

---

**Implementado em:** 14/10/2025  
**Status:** ✅ Responsivo e Otimizado
