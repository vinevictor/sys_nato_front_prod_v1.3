# Padrões de Estilo e CSS (Design System)

Este documento define os padrões de estilo e as diretrizes de CSS a serem seguidas em todo o projeto SisNATO. O objetivo é garantir consistência visual, melhorar a manutenibilidade do código e acelerar o desenvolvimento.

A base do nosso sistema de design é o [Chakra UI v2.5](https://chakra-ui.com/). Devemos priorizar o uso de seus tokens de tema (para cores, espaçamentos, tipografia, etc.) em vez de valores codificados (hardcoded).

## 1. Cores

A paleta de cores deve ser centralizada no tema do Chakra UI para garantir consistência.

### Cores Primárias
- **Verde Principal (Ações Primárias):** `green.600` (`#00713D`)
- **Verde Hover (Hover de Ações Primárias):** `green.700` (`#00631B`)

### Cores de Feedback
- **Sucesso:** `green.500`
- **Erro / Perigo:** `red.500`
- **Aviso (Warning):** `yellow.400`
- **Informação:** `blue.500`

### Cores de Fundo
- **Página / App:** `gray.100` ou `#F8F8F8`
- **Seções / Cards:** `white` ou `gray.50`

### Escala de Cinza (Texto e Bordas)
- **Títulos Principais:** `gray.800`
- **Texto de Corpo (Padrão):** `gray.700`
- **Texto Secundário / Placeholders:** `gray.500`
- **Bordas Padrão:** `gray.300`
- **Bordas Suaves:** `gray.200`

**Exemplo de Uso:**
```jsx
// Bom
<Button colorScheme="green">Salvar</Button>
<Text color="gray.700">Este é um texto padrão.</Text>
<Box bg="gray.50">Conteúdo</Box>

// Ruim
<Button bg="#00713D">Salvar</Button>
<Text color="#333">Texto qualquer.</Text>
```

## 2. Tipografia

Utilizamos a escala de tipografia responsiva do Chakra UI. Evite usar valores em `px`, `em` ou `rem` diretamente nos componentes.

- **Texto Base (Corpo):** `md` (1rem / 16px)
- **Texto Pequeno (Secundário):** `sm` (0.875rem / 14px)
- **Texto Muito Pequeno (Detalhes):** `xs` (0.75rem / 12px)

### Hierarquia de Títulos (`Heading`)
- **H1 (Título de Página):** `2xl` ou `3xl`
- **H2 (Título de Seção):** `xl` ou `2xl`
- **H3 (Subtítulo):** `lg` ou `xl`
- **H4 (Título de Card):** `md`

### Pesos de Fonte (`fontWeight`)
- **Normal:** `normal` (400)
- **Médio (Labels):** `medium` (500)
- **Semi-bold (Títulos):** `semibold` (600)
- **Bold (Destaques):** `bold` (700)

## 3. Espaçamento (Margin, Padding, Gap)

Utilizamos a escala de espaçamento do Chakra UI, que é baseada em um sistema de 4 pontos (1 unidade = 0.25rem = 4px).

- **Pequeno (p, m, gap):** `2` (8px), `3` (12px)
- **Médio (Padrão):** `4` (16px), `5` (20px)
- **Grande:** `6` (24px), `8` (32px)

**Exemplo de Uso:**
```jsx
// Bom
<Flex gap={4}>
  <Box p={6}>...</Box>
</Flex>

// Ruim
<div style={{ display: 'flex', gap: '15px' }}>
  <div style={{ padding: '22px' }}>...</div>
</div>
```

## 4. Bordas e Raios (`border` e `borderRadius`)

- **Raio de Borda Padrão (Inputs, Botões):** `md` (0.375rem / 6px)
- **Raio de Borda Grande (Cards, Modals):** `lg` (0.5rem / 8px) ou `xl` (0.75rem / 12px)
- **Cor da Borda Padrão:** `gray.300`
- **Estilo da Borda:** `1px solid`

**Exemplo de Uso:**
```jsx
<Box border="1px solid" borderColor="gray.300" borderRadius="lg">
  ...
</Box>
```

## 5. Sombras (`boxShadow`)

Para elevação e destaque, utilize os tokens de sombra predefinidos do Chakra UI.

- **Sombra Pequena (Hover sutil):** `sm`
- **Sombra Padrão (Cards):** `md`
- **Sombra Grande (Destaque):** `lg` ou `xl`

**Exemplo de Uso:**
```jsx
<Box boxShadow="md" _hover={{ boxShadow: "lg" }}>
  ...
</Box>
```
