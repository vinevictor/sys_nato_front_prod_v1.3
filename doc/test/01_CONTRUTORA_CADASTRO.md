# Teste de interface automatizado

## ferramentas

- MCP Puppeteer nativo do windsurf com resolução 1440x900

## Objetivo

- Realizar testes automatizados na interface de cadastro de construtoras.

## Fluxo de teste

2- logar no sistema {usuario:rbrp, senha: Rede123!@#} depois clicar em acessar
3- clicar em PAINEL ADMA
4- depois clicar em Construtora
5- clicar em criar construtora
6- preencher o cnpj com 30367375000155
7- clicar no botão com aria-label=procurar cnpj
8- verificar se os campos Razão Social,Telefone, Email
9- preencher o fantasia com King Dev Tec
10- clicar em salvar
11- verificar se a construtora foi cadastrada com sucesso
12- verificar se a construtora foi cadastrada na lista de construtoras na pagina construtoras
13- clicar em sair

## Resultado

- cadastrou a construtora com sucesso
- a construtora foi cadastrada na lista de construtoras na pagina construtoras
- saiu do sistema


