# Visão Geral, Princípios e Regras Gerais

## Missão do Sistema
O sistema SysNato tem como missão digitalizar, organizar e facilitar o fluxo de solicitações, autenticações e gestão administrativa de processos ligados ao setor imobiliário, proporcionando agilidade, transparência e segurança para todos os envolvidos.

## Visão Geral
- Plataforma web desenvolvida em Next.js com TypeScript, arquitetura modular e foco em escalabilidade.
- Interface moderna, responsiva e acessível, utilizando Chakra UI e princípios de UX/UI.
- Integração segura com backend Node.js/Express (API própria) e APIs externas para autenticação, consulta e gestão de dados, acessadas via a variável de ambiente `NEXT_PUBLIC_STRAPI_API_URL`.

## Princípios de Design
- **Clean Code:** Código limpo, legível, testável e modular.
- **DDD (Domain-Driven Design):** Separação clara entre domínios, lógica de negócio isolada.
- **SOLID:** Cada componente/função tem responsabilidade única e baixo acoplamento.
- **TDD:** Testes automatizados para garantir qualidade e evolução segura.
- **Baixo Acoplamento/Alta Coesão:** Componentes independentes, focados em resolver problemas específicos.
- **Simplicidade e Manutenibilidade:** Soluções diretas, facilitando manutenção e evolução.

## Regras Gerais
- **Padrão de nomenclatura:**
  - Inglês para variáveis, funções e arquivos de código.
  - Português para domínios, regras de negócio e documentação.
- **Arquitetura:**
  - Clean Architecture com Simple Factory.
  - Organização em camadas: apresentação, domínio, aplicação, infraestrutura.
- **ORM:** Utilização de ORM sempre que possível para persistência de dados.
- **Frontend:**
  - Priorizar TypeScript e Chakra UI.
  - Componentização e reutilização máxima.
- **Documentação:**
  - Toda nova funcionalidade deve ser documentada em `doc/context`.
  - Cada página/fluxo deve ter um arquivo próprio detalhando lógica, finalidade e componentes.
- **Commits:**
  - Seguir padrão semântico com emojis (ver: https://github.com/iuricode/padroes-de-commits/blob/main/README.md).

## Sugestão de Melhoria Contínua
- Revisar e atualizar esta documentação a cada nova entrega relevante.
- Incentivar revisão por pares para garantir aderência aos princípios.
