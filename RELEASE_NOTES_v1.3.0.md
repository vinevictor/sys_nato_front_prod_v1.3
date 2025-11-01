## 🚀 Notas de Lançamento - Versão 1.3.0

Esta versão traz melhorias significativas na experiência do usuário, na infraestrutura de desenvolvimento e na organização interna do projeto. O foco foi em otimizar a interface, automatizar processos e aprimorar a qualidade do código.

### ✨ Novas Funcionalidades e Melhorias de UI/UX

*   **Layout Responsivo para UF e Cidade**: Os campos de seleção de Estado (UF) e Cidade agora são totalmente responsivos. Em telas menores (mobile), eles são exibidos em formato de coluna para facilitar o uso, enquanto em telas maiores (desktop), são alinhados horizontalmente para um melhor aproveitamento do espaço.
*   **Padrões de UI Documentados**: Foi criado um guia de estilo (`padroes_layout_ui.md`) que define e padroniza todos os componentes da interface, como cards, modais, formulários e botões. Isso garantirá uma maior consistência visual e de experiência em todo o sistema.
*   **Melhorias nos Modais**: Os modais foram aprimorados para evitar fechamento acidental (`closeOnOverlayClick={false}`) e agora incluem um efeito de "blur" no fundo para uma aparência mais moderna.

### ⚙️ Melhorias de Infraestrutura e DevOps

*   **Pipeline de CI/CD Automatizado**: Implementamos um fluxo de trabalho de Integração e Implantação Contínua (CI/CD) com GitHub Actions. Agora, cada `push` para a branch `main` aciona automaticamente testes de build e lint. Se aprovado, o deploy é realizado no servidor de produção (VPS), garantindo entregas mais rápidas e seguras.
*   **Notificações de Deploy no Discord**: O pipeline de CI/CD está integrado ao Discord para enviar notificações em tempo real sobre o status dos builds e deploys, informando a equipe sobre sucessos e falhas instantaneamente.


### 🧹 Refatoração e Qualidade de Código

*   **Otimização de Rotas da API**: Identificamos e documentamos rotas duplicadas, como a `/api/direto/tags/getall`, que foi marcada para remoção. Essa limpeza visa centralizar a lógica e simplificar a manutenção futura.
*   **Análise de Pontos de Melhoria**: Foram documentadas oportunidades de melhoria em rotas existentes, como a necessidade de invalidação de cache na criação de chamados (`/api/chamado/post`) e o tratamento de permissões na contagem de alertas (`/api/alerts/geral/cont`), preparando o terreno para futuras otimizações.

### 📚 Documentação

*   **Documentação Contínua**: Adotamos uma política de atualização contínua da documentação. Novas funcionalidades e alterações relevantes agora são documentadas imediatamente, mantendo o conhecimento do projeto sempre sincronizado com o código.
*   **Documentação de APIs**: Foram criados documentos detalhados para várias rotas da API, incluindo `/fcweb`, `/chamado/post`, e `/alerts/geral/cont`, explicando seus fluxos, exemplos de uso e pontos de atenção.

Esta atualização representa um passo importante para a maturidade e escalabilidade do projeto, melhorando a experiência do usuário final e a eficiência da equipe de desenvolvimento.