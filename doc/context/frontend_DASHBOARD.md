# Documentação da Página DASHBOARD

## Finalidade
A página Dashboard apresenta uma visão geral dos dados do sistema por meio de gráficos e métricas, permitindo análise rápida de indicadores para usuários autenticados.

## Fluxo de Navegação
- Usuário acessa `/dashboard`.
- Visualiza cards com métricas principais e gráficos interativos.

## Componentes Envolvidos
- **Página:** `src/app/(private_route)/dashboard/page.tsx`
- **Componentes de Gráfico:**
  - `src/components/cardInfoDashboard/index.tsx`: cards com métricas (total de solicitações, média de horas, etc.).
  - `src/components/lineChart.tsx/index.tsx`: gráfico de linhas (média de horas).
  - `src/components/barChart/index.tsx`: gráfico de barras (tags de problemas).
  - `src/components/pieChart/index.tsx`: gráfico de pizza (comparativo de tipos de solicitações).

## Lógica Central
- Busca de dados via API `/api/dashboard`.
- Atualização dinâmica dos gráficos conforme filtros e interações.
- Utilização de hooks para gerenciamento de estado e efeitos.

## Padrões e Boas Práticas
- Separação de componentes para cada tipo de gráfico.
- Uso de bibliotecas especializadas (Chart.js, Recharts).
- Responsividade e acessibilidade nos gráficos.

## Pontos de Atenção
- Garantir atualização dos dados em tempo real ou próximo disso.
- Tratar possíveis erros de carregamento dos dados.

## Links Relacionados
- [src/app/(private_route)/dashboard/page.tsx](../../src/app/(private_route)/dashboard/page.tsx)
- [src/components/cardInfoDashboard/index.tsx](../../src/components/cardInfoDashboard/index.tsx)
- [src/components/lineChart.tsx/index.tsx](../../src/components/lineChart.tsx/index.tsx)
- [src/components/barChart/index.tsx](../../src/components/barChart/index.tsx)
- [src/components/pieChart/index.tsx](../../src/components/pieChart/index.tsx)
