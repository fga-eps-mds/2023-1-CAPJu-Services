# CAPJu - ProcessManagement - Service

<div align="center">
  <img src="https://i.imgur.com/0KsqIUe.png" alt="logo">
</div>

## Sobre o Projeto

O CAPJu é abreviação para _"Controle e Acompanhamento de Processos da Justiça"_, no qual trata-se de uma projeto de código aberto que tem como objetivo ajudar os usuários da 4ª vara cível da Justiça Federal na realização de gerenciar os processos.

Este repositório contém o código-fonte do serviço ProcessManagement do projeto CAPJu, seguindo uma arquitetura de microserviços e uma estrutura multi-repo. Esse serviço pertence a um conjunto de serviços que compõem a estrutura backend do projeto. Os repositórios que compõem o back-end do projeto são: [Mailer](https://github.com/fga-eps-mds/2023-2-CAPJu-Mailer-Service), [ProcessManagement](https://github.com/fga-eps-mds/2023-2-CAPJu-ProcessManagement-Service), [Role](https://github.com/fga-eps-mds/2023-2-CAPJu-Role-Service), [Note](https://github.com/fga-eps-mds/2023-2-CAPJu-Note-Service), [Unit](https://github.com/fga-eps-mds/2023-2-CAPJu-Unit-Service), [User](https://github.com/fga-eps-mds/2023-2-CAPJu-User-Service). O repositório de configuração é: [Config](https://github.com/fga-eps-mds/2023-2-CAPJu-Config)

## Tecnologias

<div style="display: flex">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="50px"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="50px"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="50px"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg" width="50px"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="50px" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg" width="50px"/>
</div>

## Estrutura do repositório

- Serviço de Usuário (User): Serviço destinado a oferecer funcionalidades robustas e escaláveis para gerenciar a autenticação, autorização, listagem e perfis dos usuários.
- Serviço de Unidades (Unit):
- Serviço de Email (Mailer):

## Arquitetura

<div align="center">
<img src="./assets/arquitetura.jpeg" width=600px />
</div>

## Instalação

### Configurando banco de dados e configurações iniciais
Para rodar localmente o banco de dados e então conseguir executar esse serviço é necessário seguir os seguintes passos:

```bash
# Clone o repositório de configuração do projeto em uma pasta dedicada ao projeto 
$ git clone https://github.com/fga-eps-mds/2023-2-CAPJu-Config

# Acesse a pasta do projeto
$ cd 2023-2-CAPJu-Config

# Dentro da raiz da pasta de configuração 2023-2-CAPJu-Config execute o comando para levantar o docker
$ docker-compose up
```

*Obs: Dentro do docker de configuração o nginx, ou proxy, irá apontar erro até todos os serviços do back-end serem levantados*


### Configurando .env do serviço

```
DB_NAME=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DIALECT=
DB_PORT=
USER_URL_API=
```

## NodeJs

Esse projeto conta com a versão 18 no [NodeJs](https://nodejs.org/en).

O [Node Version Manager](https://github.com/nvm-sh/nvm), mais comumente chamado de NVM, é a maneira mais popular de instalar várias versões do Nodejs. Essa tecnologia é recomendada para o desenvolvedor poder gerenciar diferentes versões do NodeJs conforme a necessidade do projeto.

## Docker
Para rodar esse projeto é necessário ter uma instalação do docker em sua máquina local, para consultar a instalação baseado no seu sistema operacional acesse o [site da instalação](https://docs.docker.com/engine/install/)

## Docker-compose
Para rodar esse projeto é necessário também possuir uma instalação do plugin do docker, docker-compose, em sua máquina, para o sistema operacional Windows a instalação é feita junto ao [Docker Desktop](https://docs.docker.com/compose/install/). Para instalação no sistema operacional linux basta seguir a documentação presente no site através do seguinte [link](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually)

## Execute o projeto localmente

Por conter uma arquitetura de microserviços, é necessário rodar cada serviço separadamente conforme a necessidade de uso.

```bash
# Para rodar o projeto pela primeira vez basta executar os seguintes comandos:
## Esse comando irá definir a versão de desenvolvimento do NodeJs como 18
nvm use 18 

## Esse comando irá instalar as bibliotecas
npm install 
```

## Instalando Novas Dependencias

Pode ser utilizado o seguinte comando para inserir novas dependencias na aplicação:

```bash
npm install nome-da-dependencia
```

## Rodando serviço
Para rodar o serviço basta apenas rodar o comando: 

```bash
docker-compose up
```

<!-- ## Criando banco de dados

É utilizado um sistema de migrations para mantermos o banco de dados sempre atualizado:

Obs: Para rodar os comandos listados abaixo, é necessário a criação prévia da base de dados que terá o mesmo nome da variável DB_NAME encontrada no .env.

Obs: Pra executar esses comandos, se faz necessário a instalação da sequelize-cli como pacote externo.

```bash
npm install -g sequelize-cli

# Esse comando irá instalar a sequelize-cli de maneira global e irá permitir que você rode comandos com o npx.
```

```bash
npm run migration OU npx sequelize-cli db:migrate

# Esse comando irá rodar as migrations criando as tabelas no seu banco da dados.
```

Caso seja necessário remover a última migration, pode ser usado esse comando:

```bash

npm run shred OU npx sequelize-cli db:migrate:undo

# Esse comando irá remover a última migration criada.
``` -->

## Formatação do código

A biblioteca [Prettier](https://prettier.io/) é a ferramente utilizada para adicionar a formatação padrão de código, e pode ser aplicada com o seguinte comando:

```bash
## Esse comando irá padronizar o estilo de código para o padrão estabelecido no projeto.
npm run prettify

## Esse comando irá verificar erros de sintaxe e possíveis melhorias.
npm run check-format
```

## Testes

```bash
## Esse comando irá rodar os testes do serviço escolhido.
npm run test
```

### Deployment

[GitHub Actions](https://github.com/fga-eps-mds/2023-1-CAPJu-Services/actions).

## Contribuição

Certifique-se de ler o [Guia de Contribuição](https://github.com/fga-eps-mds/2023-1-CAPJu-Front/blob/main/.github/CONTRIBUTING.md) antes de realizar qualquer atividade no projeto!

## Licença

O CAPJu está sob as regras aplicadas na licença [MIT](https://github.com/fga-eps-mds/2023-1-CAPJu-Front/blob/main/LICENSE)

## Contribuidores

<a href="https://github.com/fga-eps-mds/2023-2-CAPJu-Services/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fga-eps-mds/2023-2-CAPJu-Services" />
</a>
