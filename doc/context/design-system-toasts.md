# Design System - Toasts Customizados

## Finalidade
Sistema de notificações toast com design moderno, cores fixas independentes do tema, gradientes sutis e alta legibilidade.

## Arquivo de Configuração
`src/theme/index.ts`

## Características Principais

### 1. Cores Fixas
Os toasts **não mudam** com o tema dark/light, mantendo identidade visual própria para reconhecimento imediato.

**Decisão de Design:**
Notificações são elementos temporários e críticos que precisam de máxima visibilidade e reconhecimento instantâneo do status, independente do tema ativo.

### 2. Gradientes Modernos
Todos os toasts sólidos usam gradientes diagonais (135deg) para adicionar profundidade visual.

### 3. Tipografia Otimizada
Tamanhos aumentados para melhor legibilidade em todas as resoluções.

## Variantes

### Variante SOLID (Padrão)
Usada pela maioria dos toasts do sistema. Fundo colorido com texto branco.

#### Success (Verde)
**Mapeamento:** `status: "success"` → `colorScheme: "green"`

```typescript
green: {
  bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
  borderColor: "#10B981",
  color: "white",
  icon: "white",
}
```

**Quando usar:**
- Operação completada com sucesso
- Dados salvos
- Registro criado/atualizado
- Status ativado

**Exemplos:**
- "Financeira criada com sucesso"
- "Dados encontrados!"
- "Financeira ativada com sucesso!"

#### Error (Vermelho)
**Mapeamento:** `status: "error"` → `colorScheme: "red"`

```typescript
red: {
  bg: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
  borderColor: "#EF4444",
  color: "white",
  icon: "white",
}
```

**Quando usar:**
- Erro em operação
- Validação falhou
- Dados não encontrados
- Falha de conexão

**Exemplos:**
- "Erro ao salvar financeira"
- "CNPJ não encontrado"
- "Ocorreu um erro ao buscar dados"

#### Warning (Laranja)
**Mapeamento:** `status: "warning"` → `colorScheme: "orange"`

```typescript
orange: {
  bg: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  borderColor: "#FBBF24",
  color: "white",
  icon: "white",
}
```

**Quando usar:**
- Validação de campos
- Atenção necessária
- Ação precisa de confirmação
- Dados incompletos

**Exemplos:**
- "Campos obrigatórios"
- "CNPJ inválido"
- "Preencha todos os campos"

#### Info (Azul)
**Mapeamento:** `status: "info"` → `colorScheme: "blue"`

```typescript
blue: {
  bg: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
  borderColor: "#60A5FA",
  color: "white",
  icon: "white",
}
```

**Quando usar:**
- Informações gerais
- Dicas
- Status neutro
- Mensagens informativas

### Variante SUBTLE (Suave)
Fundos claros com ícones e textos coloridos. Menos usada, para notificações menos críticas.

```typescript
green: {
  bg: "#ECFDF5", // Verde muito claro
  borderColor: "#10B981",
  color: "#047857", // Verde escuro rico
  icon: "#059669",
}
```

## Tipografia e Espaçamentos

### Container
```typescript
container: {
  fontSize: "lg",        // 18px
  minHeight: "70px",
  padding: "18px 24px",
  borderRadius: "14px",
  boxShadow: "xl",
  border: "2px solid",
  fontWeight: "500",
}
```

### Título
```typescript
title: {
  fontSize: "xl",           // 20px
  fontWeight: "700",        // Bold
  marginBottom: "6px",
  letterSpacing: "0.01em",
}
```

### Descrição
```typescript
description: {
  fontSize: "md",       // 16px
  lineHeight: "1.6",
  fontWeight: "400",
}
```

### Ícone
```typescript
icon: {
  width: "28px",
  height: "28px",
  marginRight: "4px",
}
```

## Uso no Código

### Básico
```typescript
toast({
  title: "Sucesso!",
  description: "Operação realizada com sucesso",
  status: "success",     // success | error | warning | info
  duration: 3000,        // ms
  position: "top-right", // padrão do sistema
  isClosable: true,
});
```

### Com Loading
```typescript
// Mostrar toast durante operação
const toastId = toast({
  title: "Processando...",
  description: "Aguarde enquanto salvamos os dados",
  status: "info",
  duration: null,     // Não fecha automaticamente
  isClosable: false,
});

// Após operação
toast.close(toastId);
toast({
  title: "Concluído!",
  status: "success",
});
```

### Personalizado
```typescript
toast({
  title: "Atenção",
  description: "Esta ação não pode ser desfeita",
  status: "warning",
  duration: 5000,
  position: "top",
  isClosable: true,
  variant: "solid", // ou "subtle"
});
```

## Posições Disponíveis
- `top`
- `top-right` (padrão no sistema)
- `top-left`
- `bottom`
- `bottom-right`
- `bottom-left`

## Durações Recomendadas

| Tipo | Duração | Uso |
|------|---------|-----|
| Success | 3000ms | Confirmação rápida |
| Error | 4000-5000ms | Usuário precisa ler |
| Warning | 3000-4000ms | Atenção moderada |
| Info | 2000-3000ms | Informação breve |

## Mapeamento Automático Chakra UI

O Chakra UI converte automaticamente o `status` para `colorScheme`:

```typescript
status: "success" → colorScheme: "green"
status: "error"   → colorScheme: "red"
status: "warning" → colorScheme: "orange"
status: "info"    → colorScheme: "blue"
```

**Importante:** Por isso as cores no tema usam `green`, `red`, `orange`, `blue` em vez de `success`, `error`, etc.

## Acessibilidade

### Contraste
- Todos os toasts solid têm contraste mínimo de 4.5:1 (WCAG AA)
- Texto branco sobre fundos escuros garante legibilidade
- Bordas coloridas adicionam destaque visual

### Ícones
- Ícones de 28x28px são facilmente visíveis
- Cores consistentes com o status
- Reforçam visualmente o tipo de notificação

### Fechamento
- Botão de fechar sempre visível
- `isClosable: true` por padrão
- Opção de auto-close com duração

## Exemplos de Uso no Sistema

### Financeiras - Criação
```typescript
toast({
  title: "Sucesso",
  description: "Financeira criada com sucesso",
  status: "success",
  duration: 3000,
  isClosable: true,
});
```

### Financeiras - Busca CNPJ
```typescript
// Sucesso
toast({
  title: "Dados encontrados!",
  description: "Os campos foram preenchidos com os dados da empresa",
  status: "success",
  duration: 3000,
  position: "top-right",
});

// Erro
toast({
  title: "CNPJ não encontrado",
  description: "Não foi possível encontrar dados para este CNPJ",
  status: "error",
  duration: 4000,
});

// Validação
toast({
  title: "CNPJ inválido",
  description: "Digite um CNPJ válido com 14 dígitos",
  status: "warning",
  duration: 3000,
});
```

### Toggle Status
```typescript
toast({
  title: "Sucesso!",
  description: `Financeira ${ativo ? "ativada" : "desativada"} com sucesso!`,
  status: "success",
  duration: 3000,
});
```

## Diferenças com Tema Padrão Chakra

### Antes (Padrão Chakra)
- ❌ Cores mudavam com tema
- ❌ Texto podia ficar ilegível em dark mode
- ❌ Tamanhos menores
- ❌ Sem gradientes

### Depois (Customizado)
- ✅ Cores fixas e vibrantes
- ✅ Sempre legível
- ✅ Tipografia maior
- ✅ Gradientes modernos
- ✅ Bordas destacadas
- ✅ Ícones maiores

## Manutenção

### Adicionar Nova Cor
```typescript
purple: {
  bg: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
  borderColor: "#C084FC",
  color: "white",
  icon: "white",
}
```

### Ajustar Tamanhos
Modificar em `baseStyle.container`, `title`, `description`, `icon`.

### Mudar Gradiente
Ajustar cores no `linear-gradient` em cada status.

## Compatibilidade
- Next.js 14+
- Chakra UI 2.x
- TypeScript
- Todos navegadores modernos
- Dark mode / Light mode

## Performance
- Estilos compilados em build time
- Sem cálculos runtime
- CSS otimizado
- Gradientes via CSS (hardware accelerated)

## Links Relacionados
- **Tema:** `src/theme/index.ts`
- **Provider:** `src/provider/ChakraProviders.tsx`
- **Documentação Chakra:** https://chakra-ui.com/docs/components/toast
