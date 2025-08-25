# SelectBasic Component

O componente `SelectBasic` é um componente de seleção reutilizável e dinâmico construído com Chakra UI.

## Recursos

- Totalmente tipado com TypeScript
- Suporte a campos personalizados para value/label
- Renderização customizada de opções
- Placeholder customizável
- Indicador de carregamento
- Compatível com Next.js App Router

## Props

| Prop | Tipo | Descrição | Padrão |
|------|------|-----------|--------|
| id | string | ID do elemento select | - |
| onvalue | (value: string \| number) => void | Função chamada quando o valor é alterado | - |
| label | string | Rótulo do campo | - |
| options | T[] | Lista de opções disponíveis | - |
| valueField | string | Nome do campo usado como valor | 'id' |
| labelField | string | Nome do campo usado como label | 'fantasia' |
| renderOption | (option: T) => React.ReactNode | Função para renderizar opções customizadas | - |
| placeholder | string | Placeholder customizado | 'Selecione' |
| required | boolean | Indica se o campo é obrigatório | false |
| Disable | boolean | Indica se o campo está desabilitado | false |
| boxWidth | string | Largura do campo | - |
| isLoading | boolean | Indica se está carregando dados | false |

## Exemplos de Uso

### Uso básico

```tsx
import SelectBasic from "@/components/input/select-basic";

const options = [
  { id: 1, fantasia: "Opção 1" },
  { id: 2, fantasia: "Opção 2" },
];

<SelectBasic
  id="select-basic"
  label="Selecione uma opção"
  options={options}
  onvalue={(value) => console.log(value)}
  required
/>
```

### Uso com campos personalizados

```tsx
const customOptions = [
  { value: "A", name: "Opção A" },
  { value: "B", name: "Opção B" },
];

<SelectBasic
  id="select-custom"
  label="Selecione uma opção"
  options={customOptions}
  valueField="value"
  labelField="name"
  onvalue={(value) => console.log(value)}
/>
```

### Uso com renderização customizada

```tsx
const userOptions = [
  { id: 1, name: "João", avatar: "/avatar1.jpg" },
  { id: 2, name: "Maria", avatar: "/avatar2.jpg" },
];

<SelectBasic
  id="select-users"
  label="Selecione um usuário"
  options={userOptions}
  renderOption={(option) => (
    <Flex align="center" gap={2}>
      <Avatar src={option.avatar} size="xs" />
      <Text>{option.name}</Text>
    </Flex>
  )}
  onvalue={(value) => console.log(value)}
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
- Quando `renderOption` é fornecido, ele tem precedência sobre `labelField`
