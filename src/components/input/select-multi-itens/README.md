# SelectMultiItem Component

O componente `SelectMultiItem` é um componente de seleção múltipla reutilizável e dinâmico construído com Chakra UI.

## Recursos

- Totalmente tipado com TypeScript
- Suporte a campos personalizados para value/label
- Renderização customizada de itens
- Indicador de carregamento ao excluir itens
- Integração com APIs para operações CRUD
- Compatível com Next.js App Router

## Props

| Prop | Tipo | Descrição | Padrão |
|------|------|-----------|--------|
| id | string | ID do elemento select | - |
| label | string | Rótulo do campo | - |
| options | T[] | Lista de opções disponíveis | - |
| valueField | string | Nome do campo usado como valor | 'id' |
| labelField | string | Nome do campo usado como label | 'label' |
| renderItem | (item: T) => React.ReactNode | Função para renderizar itens customizados | - |
| fetchUrlGet | string | URL para buscar os itens | - |
| fetchUrlPost | (id: string \| number) => string | Função que retorna a URL para adicionar um item | - |
| fetchUrlPatch | (id: string \| number) => string | Função que retorna a URL para atualizar um item | - |
| fetchUrlDelete | (id: string \| number) => string | Função que retorna a URL para excluir um item | - |
| onChange | (items: T[]) => void | Função chamada quando os itens são alterados | - |
| required | boolean | Indica se o campo é obrigatório | false |
| boxWidth | string | Largura do campo | - |

## Exemplos de Uso

### Uso básico

```tsx
import SelectMultiItem from "@/components/input/select-multi-itens";

const options = [
  { id: 1, label: "Tag 1" },
  { id: 2, label: "Tag 2" },
];

<SelectMultiItem
  id="tags"
  label="Selecione as tags"
  options={options}
  onChange={(items) => console.log(items)}
  required
/>
```

### Uso com campos personalizados

```tsx
const customOptions = [
  { value: "A", name: "Opção A" },
  { value: "B", name: "Opção B" },
];

<SelectMultiItem
  id="custom-tags"
  label="Selecione as opções"
  options={customOptions}
  valueField="value"
  labelField="name"
  onChange={(items) => console.log(items)}
/>
```

### Uso com renderização customizada

```tsx
const userOptions = [
  { id: 1, name: "João", avatar: "/avatar1.jpg" },
  { id: 2, name: "Maria", avatar: "/avatar2.jpg" },
];

<SelectMultiItem
  id="users"
  label="Selecione os usuários"
  options={userOptions}
  renderItem={(item) => (
    <Flex align="center" gap={2}>
      <Avatar src={item.avatar} size="xs" />
      <Text>{item.name}</Text>
    </Flex>
  )}
  onChange={(items) => console.log(items)}
/>
```

### Uso com integração API

```tsx
<SelectMultiItem
  id="api-tags"
  label="Tags"
  fetchUrlGet="/api/tags"
  fetchUrlPost={(id) => `/api/tags/add/${id}`}
  fetchUrlDelete={(id) => `/api/tags/delete/${id}`}
  options={tagsOptions}
  onChange={(items) => setTags(items)}
  required
/>
```

## Compatibilidade

O componente é compatível com:
- Next.js 14 App Router
- React 18+
- Chakra UI
- TypeScript

## Notas

- O componente é automaticamente tipado com base nas opções fornecidas
- O campo `valueField` é usado como chave única para as opções
- Quando `renderItem` é fornecido, ele tem precedência sobre `labelField`
- Ao excluir itens, é exibido um BeatLoader como indicador de carregamento
