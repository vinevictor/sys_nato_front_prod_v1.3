# Padrões de Layout e UI - Sistema NATO

Este documento define os padrões de layout, estrutura e estilização utilizados no projeto Sistema NATO. Todos os novos componentes e páginas devem seguir estes padrões para manter consistência visual e de experiência.

## Sumário

1. [Estrutura de Páginas](#estrutura-de-páginas)
2. [Sistema de Cores](#sistema-de-cores)
3. [Componentes de UI](#componentes-de-ui)
4. [Modais](#modais)
5. [Formulários](#formulários)
6. [Responsividade](#responsividade)
7. [Dark Mode](#dark-mode)
8. [Animações e Transições](#animações-e-transições)
9. [Tipografia](#tipografia)
10. [Espaçamento](#espaçamento)

---

## Estrutura de Páginas

### Layout Base

Todas as páginas administrativas seguem uma estrutura consistente:

```tsx
<Container maxW={{ base: "100%", sm: "95%", md: "96%", lg: "98%" }} py={{ base: 4, md: 5, lg: 6 }} px={{ base: 3, sm: 4, md: 5, lg: 6 }}>
  <VStack spacing={{ base: 5, md: 6, lg: 8 }} align="stretch" w="full">
    {/* Cabeçalho */}
    {/* Conteúdo */}
  </VStack>
</Container>
```

**Características:**
- Container responsivo que ocupa entre 95% e 98% da largura
- Padding vertical e horizontal escalonado por breakpoint
- VStack com spacing progressivo
- Alinhamento stretch para ocupar largura total

### Cabeçalho de Página

Padrão para cabeçalhos de páginas administrativas:

```tsx
<Flex
  bg="white"
  _dark={{ bg: "gray.800", borderBottomColor: "#00d672" }}
  borderBottomWidth="2px"
  borderBottomColor="#00713D"
  p={{ base: 4, sm: 5, md: 6 }}
  align="center"
  justify="space-between"
  wrap="wrap"
  gap={{ base: 3, md: 4 }}
  borderRadius={{ base: "md", md: "lg", xl: "xl" }}
  borderBottomRadius={0}
  shadow={{ base: "sm", md: "md", lg: "lg" }}
  flexDir={{ base: "column", md: "row" }}
>
  {/* Título com ícone */}
  <Flex align="center" gap={{ base: 2, md: 3 }}>
    <Box
      p={{ base: 1.5, md: 2 }}
      bg="green.50"
      _dark={{ bg: "green.900" }}
      borderRadius="md"
      display={{ base: "none", sm: "block" }}
    >
      <MdIconName size={32} color="#00713D" />
    </Box>
    <Box>
      <Heading
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        size={{ base: "md", md: "lg" }}
        color="#023147"
        _dark={{ color: "gray.100" }}
      >
        Título da Página
      </Heading>
      <Text
        fontSize={{ base: "xs", sm: "sm", md: "md" }}
        color="gray.600"
        _dark={{ color: "gray.400" }}
        display={{ base: "none", sm: "block" }}
      >
        Descrição da página
      </Text>
    </Box>
  </Flex>

  {/* Ações (botões) */}
  <Flex gap={2} wrap="wrap">
    {/* Botões de ação */}
  </Flex>
</Flex>
```

**Elementos principais:**
- **Borda inferior colorida**: `borderBottomWidth="2px"` com cor da marca `#00713D`
- **Ícone**: Dentro de um box com background `green.50`, oculto em mobile
- **Título**: `Heading` com tamanhos responsivos
- **Descrição**: `Text` oculto em mobile, visível a partir de `sm`
- **Botões**: Flex com gap para espaçamento

### Área de Conteúdo

Container principal para o conteúdo da página:

```tsx
<VStack
  spacing={6}
  align="stretch"
  bg="white"
  _dark={{ bg: "gray.800" }}
  p={{ base: 4, md: 6 }}
  borderRadius="xl"
  borderTopRadius={0}
  shadow="lg"
  minH="400px"
>
  {/* Filtros */}
  {/* Lista/Grid de items */}
</VStack>
```

**Características:**
- Conecta visualmente com o cabeçalho (`borderTopRadius={0}`)
- Altura mínima de 400px
- Padding responsivo
- Background branco com suporte a dark mode

---

## Sistema de Cores

### Paleta Principal

#### Cores Primárias (Verde)
```css
/* Light Mode */
--primary-dark: #00713D;     /* Cor principal da marca */
--primary-medium: #005a31;   /* Hover states */
--primary-light: #00d672;    /* Acentos e detalhes */
--primary-ultra-light: #00c060; /* Dark mode hover */

/* Backgrounds */
--primary-bg: green.50;      /* Fundo de ícones e badges */
--primary-bg-dark: green.900; /* Dark mode background */
```

#### Cores Secundárias
```css
/* Cinzas */
--text-primary: #023147;     /* Títulos principais */
--text-secondary: gray.600;   /* Textos secundários */
--text-tertiary: gray.400;    /* Textos terciários */

/* Backgrounds */
--bg-white: white;
--bg-gray-50: gray.50;        /* Fundos de seções */
--bg-gray-200: gray.200;      /* Bordas */

/* Dark Mode */
--bg-dark-800: gray.800;      /* Background principal */
--bg-dark-900: gray.900;      /* Background de seções */
--bg-dark-700: gray.700;      /* Bordas */
```

#### Cores de Status
```css
/* Sucesso */
--success: green.500;
--success-dark: green.600;

/* Erro */
--error: red.500;
--error-dark: red.600;

/* Informação */
--info: blue.500;
--info-dark: blue.600;

/* Aviso */
--warning: yellow.500;
--warning-dark: yellow.600;
```

### Gradientes

#### Gradiente Principal (Cabeçalhos de Cards)
```tsx
bg="linear-gradient(135deg, #00713D 0%, #005a31 100%)"
_dark={{ bg: "linear-gradient(135deg, #00d672 0%, #00c060 100%)" }}
```

#### Gradiente Decorativo (Linhas superiores)
```tsx
bgGradient="linear(to-r, #00713D, #00d672)"
```

---

## Componentes de UI

### 1. Cards Estatísticos

Utilizados no painel administrativo para exibir métricas:

**Referência:** [src/components/adm/card/index.tsx](../../src/components/adm/card/index.tsx)

```tsx
<Box
  bg="white"
  _dark={{ bg: "gray.800", borderColor: "gray.700" }}
  p={{ base: 3.5, sm: 4, md: 5 }}
  borderRadius={{ base: "lg", md: "xl" }}
  shadow={{ base: "sm", md: "md" }}
  borderWidth="1px"
  borderColor="gray.200"
  transition="all 0.3s"
  _hover={{
    transform: "translateY(-4px)",
    shadow: "xl",
    borderColor: "#00713D",
  }}
  position="relative"
  overflow="hidden"
  minH={{ base: "130px", sm: "140px", md: "160px" }}
  w="100%"
>
  {/* Gradiente decorativo superior */}
  <Box
    position="absolute"
    top={0}
    left={0}
    right={0}
    h="4px"
    bgGradient="linear(to-r, #00713D, #00d672)"
  />

  <Flex direction="column" gap={3} align="flex-start" w="full">
    {/* Ícone */}
    <Box
      p={{ base: 2, md: 2.5 }}
      bg="green.50"
      _dark={{ bg: "green.900", color: "#00d672" }}
      borderRadius="lg"
      color="#00713D"
    >
      {icon}
    </Box>

    {/* Título */}
    <Text
      fontSize={{ base: "xs", md: "sm" }}
      fontWeight="medium"
      color="gray.600"
      _dark={{ color: "gray.400" }}
      lineHeight="1.2"
      noOfLines={2}
    >
      {title}
    </Text>

    {/* Valor */}
    <Heading
      size={{ base: "xl", md: "2xl" }}
      color="#023147"
      _dark={{ color: "gray.100" }}
      fontWeight="bold"
    >
      {count}
    </Heading>
  </Flex>
</Box>
```

**Características:**
- Barra decorativa superior com gradiente
- Hover effect: elevação e mudança de borda
- Ícone com background colorido
- Skeleton para loading states
- Memoização com `React.memo`

### 2. Cards de Listagem (Empreendimentos)

**Referência:** [src/components/empreendimentoCard/index.tsx](../../src/components/empreendimentoCard/index.tsx)

```tsx
<Flex
  direction="column"
  bg="white"
  borderRadius="xl"
  borderWidth="1px"
  borderColor="gray.200"
  overflow="hidden"
  transition="all 0.3s"
  _hover={{
    transform: "translateY(-4px)",
    shadow: "xl",
    borderColor: "#00713D",
  }}
  _dark={{
    bg: "gray.800",
    borderColor: "gray.700",
    _hover: { borderColor: "#00d672" },
  }}
>
  {/* Cabeçalho do Card com gradiente */}
  <Flex
    bg="linear-gradient(135deg, #00713D 0%, #005a31 100%)"
    _dark={{ bg: "linear-gradient(135deg, #00d672 0%, #00c060 100%)" }}
    p={4}
    align="center"
    gap={3}
  >
    <Icon as={MdIcon} w={6} h={6} color="white" _dark={{ color: "gray.900" }} />
    <Box flex="1">
      <Heading size="sm" color="white" _dark={{ color: "gray.900" }} noOfLines={1}>
        {titulo}
      </Heading>
      <Text fontSize="xs" color="whiteAlpha.800" _dark={{ color: "gray.700" }}>
        ID: {id}
      </Text>
    </Box>
    <Badge
      bg={status ? "green.500" : "red.500"}
      color="white"
      fontSize="xs"
      px={2}
      py={1}
      borderRadius="md"
    >
      {status ? "Ativo" : "Inativo"}
    </Badge>
  </Flex>

  {/* Conteúdo */}
  <VStack align="stretch" spacing={3} p={4} flex="1">
    {/* Seções de informação */}
  </VStack>

  {/* Rodapé com ações */}
  <Flex
    p={3}
    gap={2}
    justifyContent="flex-end"
    bg="gray.50"
    _dark={{ bg: "gray.900" }}
  >
    {/* Botões de ação */}
  </Flex>
</Flex>
```

**Características:**
- Cabeçalho com gradiente colorido
- Badge de status no cabeçalho
- Divisores (`<Divider />`) entre seções
- Rodapé com background diferenciado
- Hover effect consistente

### 3. Área de Filtros

Padrão para seções de filtros:

```tsx
<Box
  w="full"
  bg="gray.50"
  p={{ base: 4, md: 6 }}
  borderRadius="lg"
  borderWidth="1px"
  borderColor="gray.200"
  _dark={{ bg: "gray.900", borderColor: "gray.700" }}
>
  <Heading
    size="sm"
    mb={4}
    color="#023147"
    _dark={{ color: "gray.100" }}
  >
    Filtrar {Entidade}
  </Heading>

  <SimpleGrid
    columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 7 }}
    spacing={4}
  >
    {/* Campos de filtro */}
  </SimpleGrid>

  {/* Contador de resultados */}
  <Flex mt={4} justify="space-between" align="center">
    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
      {count} {label}
    </Text>

    {temFiltrosAtivos && (
      <Button size="sm" variant="ghost" colorScheme="red" onClick={limparFiltros}>
        Limpar Filtros
      </Button>
    )}
  </Flex>
</Box>
```

**Características:**
- Background diferenciado (`gray.50`)
- Grid responsivo para filtros
- Contador de resultados
- Botão para limpar filtros (quando aplicados)

### 4. Campos de Filtro

#### Input de Busca
```tsx
<Box>
  <Text
    fontSize="sm"
    fontWeight="medium"
    mb={2}
    color="gray.700"
    _dark={{ color: "gray.300" }}
  >
    {label}
  </Text>
  <InputGroup>
    <InputLeftElement pointerEvents="none">
      <Icon as={MdSearch} color="gray.400" />
    </InputLeftElement>
    <Input
      placeholder={placeholder}
      value={valor}
      onChange={onChange}
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.600" }}
      borderColor="gray.300"
      _hover={{ borderColor: "#00713D" }}
      _focus={{
        borderColor: "#00713D",
        boxShadow: "0 0 0 1px #00713D",
      }}
    />
  </InputGroup>
</Box>
```

#### Select
```tsx
<Box>
  <Text
    fontSize="sm"
    fontWeight="medium"
    mb={2}
    color="gray.700"
    _dark={{ color: "gray.300" }}
  >
    {label}
  </Text>
  <Select
    placeholder={placeholder}
    value={valor}
    onChange={onChange}
    bg="white"
    color="gray.800"
    borderColor="gray.300"
    icon={<MdIcon />}
    _hover={{ borderColor: "#00713D" }}
    _focus={{
      borderColor: "#00713D",
      boxShadow: "0 0 0 1px #00713D",
    }}
    _dark={{
      bg: "gray.800",
      borderColor: "gray.600",
      color: "gray.100",
    }}
    sx={{
      "& option": {
        bg: "white",
        color: "gray.800",
      },
      "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
        bg: "gray.800",
        color: "gray.100",
      },
    }}
  >
    {options}
  </Select>
</Box>
```

**Nota importante:** O `sx` em Select é necessário para estilizar as options no dark mode corretamente.

### 5. Botões

#### Botão Primário (Criar/Adicionar)
```tsx
<Button
  leftIcon={<MdAdd />}
  colorScheme="green"
  bg="#00713D"
  size={{ base: "md", md: "lg" }}
  onClick={onClick}
  transition="all 0.2s"
  w={{ base: "full", md: "auto" }}
  _hover={{
    bg: "#005a31",
    transform: "translateY(-2px)",
    shadow: "lg",
  }}
  _active={{ transform: "translateY(0)" }}
  _dark={{
    bg: "#00d672",
    color: "gray.900",
    _hover: { bg: "#00c060" },
  }}
>
  Criar Novo
</Button>
```

**Características:**
- Ícone à esquerda
- Animação de elevação no hover
- Largura total em mobile
- Cores invertidas no dark mode

#### Botão Secundário (Limpar Filtros)
```tsx
<Button
  size="sm"
  variant="ghost"
  colorScheme="red"
  onClick={onClick}
>
  Limpar Filtros
</Button>
```

### 6. Estados Vazios

#### Sem Resultados com Filtros
```tsx
<Flex
  w="full"
  minH="300px"
  justifyContent="center"
  alignItems="center"
  bg="gray.50"
  _dark={{ bg: "gray.900" }}
  borderRadius="lg"
  p={8}
  flexDir="column"
  gap={4}
>
  <Icon as={MdSearch} w={16} h={16} color="gray.400" />
  <Text
    fontSize="lg"
    color="gray.600"
    _dark={{ color: "gray.400" }}
    textAlign="center"
  >
    Nenhum item encontrado com os filtros aplicados
  </Text>
  <Button
    colorScheme="green"
    variant="outline"
    onClick={limparFiltros}
  >
    Limpar Filtros
  </Button>
</Flex>
```

#### Lista Vazia
```tsx
<Flex
  w="full"
  minH="300px"
  justifyContent="center"
  alignItems="center"
  bg="gray.50"
  _dark={{ bg: "gray.900" }}
  borderRadius="lg"
  p={8}
  flexDir="column"
  gap={4}
>
  <Icon as={MdIcon} w={16} h={16} color="gray.400" />
  <Text
    fontSize="lg"
    color="gray.600"
    _dark={{ color: "gray.400" }}
    textAlign="center"
  >
    Nenhum item cadastrado ainda.
  </Text>
  <Button
    leftIcon={<MdAdd />}
    colorScheme="green"
    onClick={onCriar}
  >
    Criar Primeiro Item
  </Button>
</Flex>
```

### 7. Skeletons de Carregamento

Para listas em carregamento:

```tsx
<SimpleGrid
  columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
  spacing={6}
  w="full"
>
  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
    <Skeleton
      key={index}
      height="350px"
      borderRadius="xl"
      startColor="gray.200"
      endColor="gray.700"
    />
  ))}
</SimpleGrid>
```

Para valores em cards:

```tsx
<Skeleton
  height={{ base: "32px", md: "40px" }}
  width="80%"
  startColor="gray.100"
  endColor="gray.300"
  borderRadius="md"
/>
```

---

## Modais

Os modais seguem padrões consistentes de estrutura, overlay e comportamento.

### Estrutura Base de Modal

**Referência:** [src/components/tagsClient/modal/index.tsx](../../src/components/tagsClient/modal/index.tsx)

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  size="xl"  // ou "md", "lg", "2xl", "3xl", "6xl"
  isCentered
  closeOnOverlayClick={false}  // Previne fechamento acidental
>
  <ModalOverlay
    bg="blackAlpha.600"
    backdropFilter="blur(10px)"
  />
  <ModalContent
    bg="white"
    _dark={{ bg: "gray.800" }}
    borderRadius="xl"
    shadow="2xl"
  >
    <ModalHeader
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="bold"
      color="#023147"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      _dark={{ color: "gray.100", borderBottomColor: "gray.700" }}
    >
      Título do Modal
    </ModalHeader>
    <ModalCloseButton
      _hover={{ bg: "red.100", color: "red.600" }}
      _dark={{ _hover: { bg: "red.900", color: "red.300" } }}
    />

    <ModalBody py={6}>
      {/* Conteúdo do modal */}
    </ModalBody>
  </ModalContent>
</Modal>
```

**Características principais:**
- `closeOnOverlayClick={false}`: Evita fechamento acidental
- `isCentered`: Modal centralizado verticalmente
- Overlay com blur para efeito moderno
- Header com borda inferior
- CloseButton com hover vermelho
- Suporte completo a dark mode

### Tamanhos de Modal

Escolha o tamanho adequado baseado no conteúdo:

```tsx
// Pequeno - Confirmações simples
size="md"  // 448px

// Médio - Formulários pequenos
size="lg"  // 512px

// Grande - Formulários médios (padrão para tags)
size="xl"  // 576px

// Extra Grande - Formulários complexos
size="2xl"  // 672px
size="3xl"  // 768px

// Full Width - Formulários muito complexos (empreendimentos)
size="6xl"  // 1152px
```

### Modal com Footer de Ações

**Referência:** [src/components/adm/modal/add_cobranca/index.tsx](../../src/components/adm/modal/add_cobranca/index.tsx)

```tsx
<Modal
  closeOnOverlayClick={false}
  isCentered
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
  <ModalContent>
    <ModalHeader>Título do Modal</ModalHeader>
    <ModalCloseButton />

    <ModalBody display="flex" flexDirection="column" gap={4}>
      {/* Campos do formulário */}
    </ModalBody>

    <ModalFooter>
      <Button
        isLoading={loading}
        onClick={handleClose}
      >
        Cancelar
      </Button>
      <Button
        isLoading={loading}
        colorScheme="blue"
        onClick={handleSubmit}
      >
        Confirmar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**Características:**
- ModalBody com `display="flex"` e `flexDirection="column"`
- Gap de 4 para espaçamento entre campos
- Footer com dois botões (Cancelar e Confirmar)
- Loading state nos botões

### Botão de Abertura do Modal

#### Botão Primário (Verde)
```tsx
<Button
  leftIcon={<MdAdd />}
  colorScheme="green"
  bg="#00713D"
  size={{ base: "md", md: "lg" }}
  onClick={onOpen}
  transition="all 0.2s"
  w={{ base: "full", md: "auto" }}
  _hover={{
    bg: "#005a31",
    transform: "translateY(-2px)",
    shadow: "lg",
  }}
  _active={{ transform: "translateY(0)" }}
  _dark={{
    bg: "#00d672",
    color: "gray.900",
    _hover: { bg: "#00c060" },
  }}
>
  Criar Novo
</Button>
```

#### Botão Secundário (Azul)
```tsx
<Button
  leftIcon={<MdAddCircle size={20} />}
  bg="#3B82F6"
  color="white"
  size={{ base: "sm", md: "md" }}
  fontSize={{ base: "sm", md: "md" }}
  onClick={onOpen}
  shadow="md"
  borderWidth="2px"
  borderColor="#3B82F6"
  _hover={{
    bg: "#2563EB",
    borderColor: "#2563EB",
    transform: "translateY(-2px)",
    shadow: "lg",
  }}
  _active={{
    transform: "translateY(0)",
    shadow: "md",
  }}
  _dark={{
    bg: "#3B82F6",
    borderColor: "#60A5FA",
    _hover: {
      bg: "#2563EB",
      borderColor: "#3B82F6",
    },
  }}
  transition="all 0.2s"
>
  Nova Cobrança
</Button>
```

#### Botão de Alerta (Amarelo)
```tsx
<Button
  leftIcon={<MdNotificationsActive size={20} />}
  bg="#F59E0B"
  color="white"
  size={{ base: "sm", md: "md" }}
  fontSize={{ base: "sm", md: "md" }}
  onClick={onOpen}
  shadow="md"
  borderWidth="2px"
  borderColor="#F59E0B"
  _hover={{
    bg: "#D97706",
    borderColor: "#D97706",
    transform: "translateY(-2px)",
    shadow: "lg",
  }}
  _active={{
    transform: "translateY(0)",
    shadow: "md",
  }}
  _dark={{
    bg: "#F59E0B",
    borderColor: "#FBBF24",
    _hover: {
      bg: "#D97706",
      borderColor: "#F59E0B",
    },
  }}
  transition="all 0.2s"
>
  Alerta Geral
</Button>
```

### Modal com Loading Global

Para operações que requerem feedback visual completo:

**Referência:** [src/components/tagsClient/modal/index.tsx](../../src/components/tagsClient/modal/index.tsx:89-204)

```tsx
{isSaving && (
  <Portal>
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      direction="column"
      align="center"
      justify="center"
      bg="blackAlpha.800"
      backdropFilter="blur(10px)"
      zIndex={9999}
      p={{ base: 4, md: 8 }}
      overflow="hidden"
    >
      {/* Efeito de fundo decorativo */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="600px"
        height="600px"
        borderRadius="full"
        bg="green.50"
        _dark={{ bg: "green.900", opacity: 0.1 }}
        opacity={0.3}
        filter="blur(100px)"
        pointerEvents="none"
      />

      <VStack
        spacing={{ base: 6, md: 8 }}
        textAlign="center"
        maxW={{ base: "90%", md: "500px" }}
        bg="white"
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        shadow="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        position="relative"
        zIndex={1}
      >
        {/* Ícone animado */}
        <Box position="relative">
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={{ base: "120px", md: "160px" }}
            height={{ base: "120px", md: "160px" }}
            borderRadius="full"
            bg="green.100"
            _dark={{ bg: "green.900", opacity: 0.2 }}
            filter="blur(20px)"
          />
          <Icon
            as={MdAutorenew}
            w={{ base: 20, md: 24 }}
            h={{ base: 20, md: 24 }}
            color="green.500"
            _dark={{ color: "green.400" }}
            position="relative"
            animation="spin 2s linear infinite"
          />
        </Box>

        {/* Título */}
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="semibold"
          color="gray.800"
          _dark={{ color: "gray.100" }}
        >
          Processando
        </Heading>

        {/* Descrição */}
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="gray.600"
          _dark={{ color: "gray.300" }}
          lineHeight="1.8"
        >
          Aguarde enquanto processamos sua solicitação
        </Text>

        {/* Mensagem adicional */}
        <Text
          fontSize={{ base: "sm", md: "md" }}
          color="gray.500"
          _dark={{ color: "gray.400" }}
        >
          Isso não deve demorar muito...
        </Text>
      </VStack>

      {/* Keyframes para animação */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Flex>
  </Portal>
)}
```

**Características:**
- Usa `Portal` para renderizar fora da hierarquia
- `zIndex={9999}` para garantir sobreposição
- Fundo escuro com blur
- Card central com informações
- Ícone animado (spinning)
- Efeito decorativo de glow
- Totalmente responsivo

### Modal para Edição/Criação Complexa

Para formulários grandes (como empreendimentos):

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  size="6xl"
  scrollBehavior="inside"
>
  <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
  <ModalContent
    mx={4}
    my={8}
    _dark={{
      bg: "gray.800",
      borderColor: "gray.700",
    }}
  >
    <ModalHeader
      fontSize="2xl"
      fontWeight="bold"
      color="#023147"
      _dark={{ color: "gray.100" }}
    >
      Criar Novo Empreendimento
    </ModalHeader>
    <ModalCloseButton
      _hover={{
        bg: "red.50",
        _dark: { bg: "red.900" },
      }}
    />
    <Divider borderColor="gray.300" _dark={{ borderColor: "gray.600" }} />

    <ModalBody py={6}>
      {/* Formulário complexo */}
    </ModalBody>
  </ModalContent>
</Modal>
```

**Características:**
- `size="6xl"` para máxima largura
- `scrollBehavior="inside"` para scroll interno
- Margens externas (`mx` e `my`) para não colar nas bordas
- Divider após o header

### Padrão de Controle de Estado

```tsx
const { isOpen, onOpen, onClose } = useDisclosure();

// Função para fechar e limpar
const handleClose = () => {
  onClose();
  // Limpar campos
  setField1("");
  setField2("");
};
```

---

## Formulários

Os formulários seguem padrões consistentes de estrutura, validação e feedback.

### Estrutura Base de Formulário

**Referência:** [src/components/tagsClient/form/index.tsx](../../src/components/tagsClient/form/index.tsx)

```tsx
<Box as="form" onSubmit={handleSubmit}>
  <VStack spacing={6} align="stretch">
    {/* Header informativo */}
    <Box
      bg="gray.50"
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
    >
      <Heading
        size="sm"
        color="#023147"
        _dark={{ color: "gray.100" }}
        mb={2}
      >
        Título da Seção
      </Heading>
      <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
        Descrição ou instruções do formulário.
      </Text>
    </Box>

    {/* Seção de campos */}
    <Box>
      <Heading
        size="sm"
        mb={4}
        color="#023147"
        _dark={{ color: "gray.100" }}
      >
        Dados do Formulário
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Campos aqui */}
      </SimpleGrid>
    </Box>

    {/* Botões de ação */}
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
      <Button
        variant="outline"
        colorScheme="gray"
        size="lg"
        onClick={onCancel}
        isDisabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        leftIcon={<MdSave />}
        colorScheme="green"
        bg="#00713D"
        size="lg"
        isLoading={isSubmitting}
        loadingText="Salvando..."
        _hover={{ bg: "#005a31" }}
        _dark={{
          bg: "#00d672",
          color: "gray.900",
          _hover: { bg: "#00c060" },
        }}
      >
        Salvar
      </Button>
    </SimpleGrid>
  </VStack>
</Box>
```

**Características:**
- `as="form"` para semântica HTML
- Header com instruções
- VStack com spacing consistente
- SimpleGrid para organização de campos
- Botões em grid 1x2 (mobile/desktop)

### Campo de Texto (Input)

```tsx
<FormControl isRequired>
  <FormLabel
    fontSize="sm"
    fontWeight="md"
    color="gray.700"
    _dark={{ color: "gray.300" }}
  >
    Nome do Campo
  </FormLabel>
  <Input
    type="text"
    placeholder="Digite o valor"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    bg="white"
    borderColor="gray.300"
    _hover={{ borderColor: "green.500" }}
    _focus={{
      borderColor: "green.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
    }}
    size="lg"
    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
  />
</FormControl>
```

**Características:**
- `FormControl` com `isRequired` para campos obrigatórios
- `FormLabel` com tipografia consistente
- Border verde no focus e hover
- Size "lg" para melhor usabilidade
- Placeholder descritivo

### Select (Dropdown)

```tsx
<FormControl isRequired>
  <FormLabel
    fontSize="sm"
    fontWeight="md"
    color="gray.700"
    _dark={{ color: "gray.300" }}
  >
    Selecione uma opção
  </FormLabel>
  <Select
    value={value}
    onChange={(e) => setValue(e.target.value)}
    bg="white"
    color="gray.800"
    borderColor="gray.300"
    _hover={{ borderColor: "green.500" }}
    _focus={{
      borderColor: "green.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
    }}
    size="lg"
    _dark={{
      bg: "gray.800",
      borderColor: "gray.600",
      color: "gray.100",
    }}
    sx={{
      "& option": {
        bg: "white",
        color: "gray.800",
      },
      "&:is([data-theme='dark']) option, .chakra-ui-dark &option": {
        bg: "gray.800",
        color: "gray.100",
      },
    }}
  >
    <option value="">Selecione...</option>
    {options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.label}
      </option>
    ))}
  </Select>
</FormControl>
```

**Nota importante:** O `sx` é necessário para estilizar as options no dark mode.

### Textarea

```tsx
<FormControl isRequired>
  <FormLabel
    fontSize="sm"
    fontWeight="md"
    color="gray.700"
    _dark={{ color: "gray.300" }}
  >
    Mensagem
  </FormLabel>
  <Textarea
    placeholder="Digite sua mensagem"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    bg="white"
    borderColor="gray.300"
    _hover={{ borderColor: "green.500" }}
    _focus={{
      borderColor: "green.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
    }}
    size="lg"
    rows={4}
    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
  />
</FormControl>
```

### Input Date

```tsx
<FormControl isRequired>
  <FormLabel
    fontSize="sm"
    fontWeight="md"
    color="gray.700"
    _dark={{ color: "gray.300" }}
  >
    Data de Início
  </FormLabel>
  <Input
    type="date"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    bg="white"
    borderColor="gray.300"
    _hover={{ borderColor: "green.500" }}
    _focus={{
      borderColor: "green.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
    }}
    size="lg"
    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
  />
</FormControl>
```

### Validação e Feedback

#### Toast de Sucesso
```tsx
toast({
  title: "Sucesso!",
  description: "O item foi criado com sucesso!",
  status: "success",
  duration: 4000,
  isClosable: true,
  position: "top-right",
});
```

#### Toast de Erro
```tsx
toast({
  title: "Erro ao salvar",
  description: error.message || "Não foi possível salvar.",
  status: "error",
  duration: 5000,
  isClosable: true,
  position: "top-right",
});
```

#### Toast de Validação
```tsx
toast({
  title: "Campo obrigatório",
  description: "Por favor, informe o nome do campo.",
  status: "warning",
  duration: 4000,
  isClosable: true,
  position: "top-right",
});
```

### Padrão de Submit

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validações
  if (!field.trim()) {
    toast({
      title: "Campo obrigatório",
      description: "Por favor, informe o campo.",
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
    return;
  }

  setIsSubmitting(true);
  if (onSaving) onSaving(true);

  try {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        field: field.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao salvar");
    }

    toast({
      title: "Sucesso",
      description: "Item criado com sucesso!",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });

    router.refresh();

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    console.error("Erro:", error);
    toast({
      title: "Erro ao salvar",
      description: error.message || "Não foi possível salvar.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  } finally {
    setIsSubmitting(false);
    if (onSaving) onSaving(false);
  }
};
```

**Características:**
- `e.preventDefault()` para evitar reload
- Validações antes de submeter
- Try-catch para tratamento de erros
- Finally para limpar loading state
- Toast para feedback ao usuário
- `router.refresh()` para atualizar dados
- Callbacks opcionais (`onSuccess`, `onSaving`)

### Botões de Formulário

#### Botão Submit
```tsx
<Button
  type="submit"
  leftIcon={<MdSave />}
  colorScheme="green"
  bg="#00713D"
  size="lg"
  isLoading={isSubmitting}
  loadingText="Salvando..."
  _hover={{ bg: "#005a31" }}
  _dark={{
    bg: "#00d672",
    color: "gray.900",
    _hover: { bg: "#00c060" },
  }}
>
  Salvar
</Button>
```

#### Botão Cancelar
```tsx
<Button
  variant="outline"
  colorScheme="gray"
  size="lg"
  onClick={onCancel}
  isDisabled={isSubmitting}
>
  Cancelar
</Button>
```

### Grid de Campos

#### Uma Coluna (Mobile)
```tsx
<SimpleGrid columns={{ base: 1 }} spacing={4}>
  {/* Campos */}
</SimpleGrid>
```

#### Duas Colunas (Desktop)
```tsx
<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
  {/* Campos */}
</SimpleGrid>
```

#### Três Colunas
```tsx
<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
  {/* Campos */}
</SimpleGrid>
```

### Box de Informação em Formulários

```tsx
<Box
  bg="gray.50"
  p={4}
  borderRadius="md"
  borderWidth="1px"
  borderColor="gray.200"
  _dark={{ bg: "gray.900", borderColor: "gray.700" }}
>
  <Heading
    size="sm"
    color="#023147"
    _dark={{ color: "gray.100" }}
    mb={2}
  >
    Informações Importantes
  </Heading>
  <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
    Instruções ou informações relevantes para o usuário.
  </Text>
</Box>
```

---

## Responsividade

### Breakpoints Chakra UI

```typescript
breakpoints = {
  base: "0px",      // Mobile
  sm: "480px",      // Small mobile
  md: "768px",      // Tablet
  lg: "992px",      // Desktop
  xl: "1280px",     // Large desktop
  "2xl": "1536px"   // Extra large
}
```

### Padrões de Grid

#### Cards de Dashboard (3x2)
```tsx
<SimpleGrid
  columns={{ base: 1, sm: 2, lg: 3 }}
  spacing={{ base: 3, sm: 4, md: 5 }}
  w="full"
>
```

#### Cards de Listagem
```tsx
<SimpleGrid
  columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
  spacing={6}
  w="full"
>
```

#### Filtros
```tsx
<SimpleGrid
  columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 7 }}
  spacing={4}
>
```

### Padrões de Espaçamento Responsivo

```tsx
// Padding
p={{ base: 3, sm: 4, md: 5, lg: 6 }}

// Margin
m={{ base: 4, md: 5, lg: 6 }}

// Gap
gap={{ base: 2, md: 3, lg: 4 }}

// Spacing (VStack/HStack)
spacing={{ base: 5, md: 6, lg: 8 }}
```

### Tamanhos de Fonte Responsivos

```tsx
// Headings principais
fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
size={{ base: "md", md: "lg" }}

// Headings secundários
size={{ base: "sm", md: "md" }}

// Texto normal
fontSize={{ base: "sm", md: "md" }}

// Texto pequeno
fontSize={{ base: "xs", md: "sm" }}
```

### Visibilidade Condicional

```tsx
// Ocultar em mobile
display={{ base: "none", sm: "block" }}
display={{ base: "none", md: "flex" }}

// Mostrar apenas em mobile
display={{ base: "block", md: "none" }}
```

---

## Dark Mode

### Implementação Consistente

Todos os componentes devem suportar dark mode usando a prop `_dark`:

```tsx
<Box
  bg="white"
  _dark={{ bg: "gray.800" }}
  borderColor="gray.200"
  _dark={{ borderColor: "gray.700" }}
  color="gray.800"
  _dark={{ color: "gray.100" }}
>
```

### Mapeamento de Cores Light/Dark

| Elemento | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Background principal | `white` | `gray.800` |
| Background secundário | `gray.50` | `gray.900` |
| Bordas | `gray.200` | `gray.700` |
| Texto primário | `#023147` / `gray.800` | `gray.100` |
| Texto secundário | `gray.600` | `gray.400` |
| Texto terciário | `gray.400` | `gray.500` |
| Primary color | `#00713D` | `#00d672` |
| Primary hover | `#005a31` | `#00c060` |
| Primary background | `green.50` | `green.900` |

### Hover States no Dark Mode

```tsx
_hover={{
  borderColor: "#00713D",
}}
_dark={{
  _hover: {
    borderColor: "#00d672",
  }
}}
```

### Gradientes no Dark Mode

```tsx
bg="linear-gradient(135deg, #00713D 0%, #005a31 100%)"
_dark={{
  bg: "linear-gradient(135deg, #00d672 0%, #00c060 100%)"
}}
```

---

## Animações e Transições

### Transições Padrão

#### Cards com Hover
```tsx
transition="all 0.3s"
_hover={{
  transform: "translateY(-4px)",
  shadow: "xl",
  borderColor: "#00713D",
}}
```

#### Botões
```tsx
transition="all 0.2s"
_hover={{
  bg: "#005a31",
  transform: "translateY(-2px)",
  shadow: "lg",
}}
_active={{
  transform: "translateY(0)"
}}
```

### Durações

- **Rápida (0.2s)**: Botões, inputs, interações diretas
- **Média (0.3s)**: Cards, modais, transições de estado
- **Lenta (0.5s)**: Animações complexas, transições de página

### Easing

Usar `ease-in-out` (padrão do Chakra) para a maioria das transições.

---

## Tipografia

### Hierarquia de Headings

#### Página (Heading 1)
```tsx
<Heading
  fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
  size={{ base: "md", md: "lg" }}
  color="#023147"
  _dark={{ color: "gray.100" }}
>
```

#### Seção (Heading 2)
```tsx
<Heading
  size="sm"
  color="#023147"
  _dark={{ color: "gray.100" }}
>
```

#### Card/Subsection (Heading 3)
```tsx
<Heading
  size={{ base: "sm", md: "md" }}
  color="white"
  _dark={{ color: "gray.900" }}
>
```

### Text Variants

#### Descrição de Página
```tsx
<Text
  fontSize={{ base: "xs", sm: "sm", md: "md" }}
  color="gray.600"
  _dark={{ color: "gray.400" }}
>
```

#### Label de Campo
```tsx
<Text
  fontSize="sm"
  fontWeight="medium"
  color="gray.700"
  _dark={{ color: "gray.300" }}
>
```

#### Label de Seção (Uppercase)
```tsx
<Text
  fontSize="xs"
  fontWeight="semibold"
  color="gray.600"
  textTransform="uppercase"
  letterSpacing="wide"
  _dark={{ color: "gray.400" }}
>
```

#### Texto Secundário
```tsx
<Text
  fontSize="sm"
  color="gray.600"
  _dark={{ color: "gray.400" }}
>
```

### Font Weights

- `normal` (400): Texto padrão
- `medium` (500): Labels, valores importantes
- `semibold` (600): Labels de seção, títulos pequenos
- `bold` (700): Números, headings principais

---

## Espaçamento

### Sistema de Spacing do Chakra

Chakra UI usa um sistema de spacing baseado em múltiplos de 4px (0.25rem):

```typescript
1 = 0.25rem = 4px
2 = 0.5rem  = 8px
3 = 0.75rem = 12px
4 = 1rem    = 16px
5 = 1.25rem = 20px
6 = 1.5rem  = 24px
8 = 2rem    = 32px
```

### Padrões de Espaçamento

#### Entre Elementos (VStack/HStack)
- **Pequeno**: `spacing={3}` (12px)
- **Médio**: `spacing={4}` (16px)
- **Grande**: `spacing={6}` (24px)
- **Extra Grande**: `spacing={8}` (32px)

#### Padding de Container
- **Mobile**: `p={4}` (16px)
- **Tablet**: `p={6}` (24px)
- **Desktop**: `p={8}` (32px)

#### Gap entre Cards (Grid)
- **Mobile**: `spacing={3}` (12px)
- **Tablet**: `spacing={4}` (16px)
- **Desktop**: `spacing={6}` (24px)

#### Margin Bottom de Seções
- **Pequeno**: `mb={3}` (12px)
- **Médio**: `mb={4}` (16px)
- **Grande**: `mb={6}` (24px)

---

## Checklist de Implementação

Ao criar um novo componente ou página, verifique:

### Estrutura
- [ ] Container responsivo com maxW e padding apropriados
- [ ] VStack com spacing consistente
- [ ] Cabeçalho com borda colorida inferior
- [ ] Área de conteúdo conectada ao cabeçalho

### Estilização
- [ ] Cores seguem a paleta definida
- [ ] Gradientes aplicados corretamente
- [ ] Bordas e sombras consistentes
- [ ] Border radius apropriado

### Responsividade
- [ ] Breakpoints definidos para todos os tamanhos
- [ ] Grid/Flex adaptativo
- [ ] Fonte com tamanhos responsivos
- [ ] Padding/margin escalonados

### Dark Mode
- [ ] Todas as cores têm variante dark
- [ ] Gradientes adaptados
- [ ] Borders e sombras ajustados
- [ ] Testado visualmente no dark mode

### Modais
- [ ] `closeOnOverlayClick={false}` implementado
- [ ] `isCentered` para centralização
- [ ] Overlay com blur aplicado
- [ ] CloseButton com hover vermelho
- [ ] Tamanho apropriado para o conteúdo
- [ ] Divider após header (quando aplicável)
- [ ] Loading state implementado

### Formulários
- [ ] `as="form"` no Box wrapper
- [ ] `onSubmit` com `e.preventDefault()`
- [ ] FormControl com `isRequired` nos campos obrigatórios
- [ ] Validação antes de submeter
- [ ] Try-catch para tratamento de erros
- [ ] Toast para feedback ao usuário
- [ ] Loading states nos botões
- [ ] Grid responsivo para campos
- [ ] Border verde no focus dos inputs
- [ ] `sx` aplicado em Selects para dark mode

### Acessibilidade
- [ ] Contraste adequado de cores
- [ ] Ícones com labels (aria-label)
- [ ] Focus states visíveis
- [ ] Tamanhos de toque adequados (min 44px)
- [ ] FormLabels associados aos inputs

### Performance
- [ ] Componentes memoizados quando apropriado
- [ ] Skeletons para loading states
- [ ] Transições otimizadas
- [ ] Imagens otimizadas

### UX
- [ ] Estados vazios implementados
- [ ] Feedback de loading
- [ ] Mensagens de erro claras
- [ ] Animações suaves
- [ ] Campos limpos após submit bem-sucedido
- [ ] Modal fecha após ação bem-sucedida

---

## Exemplos de Páginas

### Páginas de Referência

1. **Painel Administrativo** - [src/app/(private_route)/(adiministrativo)/adm/page.tsx](../../src/app/(private_route)/(adiministrativo)/adm/page.tsx)
   - Dashboard com cards estatísticos
   - Layout com sidebar de alertas
   - Tabela de relatórios

2. **Empreendimentos** - [src/app/(private_route)/(adiministrativo)/empreendimentos/page.tsx](../../src/app/(private_route)/(adiministrativo)/empreendimentos/page.tsx)
   - Filtros complexos (7 campos)
   - Grid de cards com informações detalhadas
   - Modal de criação

3. **Tags** - [src/app/(private_route)/(adiministrativo)/tags/page.tsx](../../src/app/(private_route)/(adiministrativo)/tags/page.tsx)
   - Interface simples e limpa
   - Filtro único
   - Grid de tags com ações

---

## Notas Finais

### Princípios de Design

1. **Consistência**: Sempre use os mesmos padrões em todas as páginas
2. **Responsividade**: Teste em todos os breakpoints
3. **Acessibilidade**: Garanta que todos possam usar
4. **Performance**: Otimize para carregamento rápido
5. **Feedback Visual**: Sempre forneça feedback ao usuário
6. **Dark Mode**: Suporte completo em todos os componentes

### Ferramentas Úteis

- **Chakra UI Docs**: https://chakra-ui.com/docs
- **React Icons**: https://react-icons.github.io/react-icons/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

### Manutenção

Este documento deve ser atualizado sempre que novos padrões forem estabelecidos ou modificados. Revise periodicamente para garantir que reflete o estado atual do projeto.

---

**Última atualização:** 2025-10-20
**Versão:** 1.0.0
