# Arquitetura e Tecnologias

Este documento descreve a arquitetura e as principais tecnologias utilizadas no projeto `sys_nato_front_prod_v1.3`.

## Visão Geral

O projeto é uma aplicação web full-stack construída com **Next.js**, utilizando **TypeScript** para tipagem estática e **Chakra UI** para a construção da interface de usuário.

## Tecnologias Principais

### Frontend

*   **Framework:** [Next.js](https://nextjs.org/) (v14.2.15) - Framework React para produção, com renderização do lado do servidor (SSR) e geração de sites estáticos (SSG).
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (v5.8.2) - Superset do JavaScript que adiciona tipagem estática.
*   **UI Library:** [Chakra UI](https://chakra-ui.com/) (v2) - Biblioteca de componentes para React que facilita a criação de interfaces acessíveis e modulares.
*   **Estilização:** [Emotion](https://emotion.sh/) - Biblioteca para escrever estilos CSS com JavaScript.
*   **Gerenciamento de Estado:** O gerenciamento de estado é feito principalmente com os hooks do React (`useState`, `useContext`) e a passagem de props.
*   **Gráficos:**
    *   [Chart.js](https://www.chartjs.org/) (v4.4.8)
    *   [react-chartjs-2](https://react-chartjs-2.js.org/) (v5.3.0)
    *   [Recharts](https://recharts.org/) (v3.1.0)
*   **Ícones:** [React Icons](https://react-icons.github.io/react-icons/) (v5.5.0)
*   **Animações:** [Framer Motion](https://www.framer.com/motion/) (v12.7.4)

### Backend (Integrado ao Next.js - API Routes)

*   **Autenticação:**
    *   [JWT (JSON Web Tokens)](https://jwt.io/) - Utilizado para criar tokens de acesso.
    *   [jose](https://github.com/panva/jose) (v6.0.10) - Implementação de JWT e outras primitivas criptográficas.
    *   [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (v5.1.1) - Para hashing de senhas.
*   **Comunicação com API:** [Axios](https://axios-http.com/) (v1.7.7) - Cliente HTTP para realizar requisições.

### Ferramentas de Desenvolvimento (DevTools)

*   **Gerenciador de Pacotes:** [Yarn](https://yarnpkg.com/) (v1.22.22)
*   **Linting:** [ESLint](https://eslint.org/) (v9.23.0) - Para análise estática de código e imposição de padrões.
*   **Build Tool:** Integrado ao Next.js.

### Outras Dependências Notáveis

*   **Validação:** `cpf-cnpj-validator` (v1.0.3) - Para validar CPF e CNPJ.
*   **Máscaras de Input:** `react-input-mask` (v2.0.4) e `remask` (v1.2.2).
*   **Geração de PDF:** `html-pdf`, `jspdf`, `html2canvas`, `pdf-lib` - Conjunto de bibliotecas para manipulação e criação de PDFs a partir de HTML.
