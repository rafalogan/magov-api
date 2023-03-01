# Ma - Governance 🏛️

## Esse projeto foi desenvolvido em Node.js e contem API's necessárias para o sistema do MA - Governance.

### 📋 Tabela de Conteúdos

* [Status do Projeto](#Status-do-Projeto)
	* [Features](#features)
	* [Pre Requisitos](#pré-requisitos)
	* [Como usar](#back)
		* [Rodando o Back end](#Rodando-o-Back-End-(servidor))
	* [Tecnologias](#🛠-Tecnologias)

### ⚒️ Status-do-Projeto
	🚧  Em construção...  🚧

### ✔️ Features

- [x] Cadastro de usuário
- [x] Cadastro de demanda
- [x] Cadastro de tipo de demanda
- [x] Cadastro de despesa
- [x] Cadastro de tipo de despesa
- [x] Cadastro de meta
- [x] Cadastro de tipo de instituto
- [x] Cadastro de origem
- [x] Cadastro de forma de pagamentos
- [x] Cadastro de demandante
- [x] Cadastro de proposição
- [x] Cadastro de tipo de proposição
- [x] Cadastro de formulaário de recibo
- [x] Cadastro de receita
- [x] Cadastro de tipo de receita
- [x] Cadastro de esquadrão
- [x] Cadastro de tarefa
- [x] Cadastro de tema
- [x] Cadastro de demandante

### ❗ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:  
* [Git](https://git-scm.com); 
* [Node.js](https://nodejs.org/en/);
* [Typescript](https://www.typescriptlang.org);
* [knex (ORM)](https://knexjs.org/guide/)

Além disto é bom ter um editor para trabalhar com o código.

### ❗Configurando ambiente local
#### 🚩 Clone este repositório
 ``` shell 
 git clone https://GuilhermeBraganholo@bitbucket.org/danilomendes/ma-governance-api.git
```
#### 👉 Configure o .env
``` .dotenv
# VARIABLES OF ENVIROMENT
# ENVIRONMENT
NODE_ENV=

# SERVER CONFIGS
PORT=
HOST=

# TIMEZONE
TIMEZONE=

# DATA BASE CONFIG CONNECTIONS RELATIONAL
# DB_CONNECTION_URL= # Usar caso a conecção for feita via url
# DB_FILENAME= # Para uso de arquivo do sqlite
DB_CLIENT=
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=

# MIGRATIION DIR AND FILE EXTENSION
DB_MIGRATION_DIRECTORY= # default dir './databae/migrations'
DB_MIGRATION_EXTENSION= # default file extension 'ts'

# POLL OF CONECTION
DB_POOL_MIN=
DB_POOL_MAX=

DB_USE_NULL_DEFAULT= # Default true

# CORS CONFIGS
CORS_ORIGIN= 
CORS_METHODS=
CORS_PREFLIGHT_CONTIME=
CORS_OPTIONS_SUCCESS_STATUS=

# CACHE CONFIGS
ENABLE_CACHE= #Defautl false
CACHE_TIME=
REDIS_HOST=
REDIS_PORT=

# AWS CONFIGS
STORAGE_TYPE= #Defaut local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET=

#HTTPS CONFIGS
ENABLE_HTTPS= #Defaut faulse
HTTPS_CERT_FILE=
HTTPS_KEY_FILE=

# SECURITY CONFIGS
SALT_ROUNDS=
AUTHSECRET=

#MAIL ENVIROMENT
MAILER_HOST=
MAILER_PORT=
MAILER_SERVICE=
MAILER_USER=
MAILER_PASSWORD=
EMAIL_DEFAULT=
```
[//]: # (DB_HOST=128.199.5.141)

[//]: # (DB_USER="root"<br />)

[//]: # (DB_PASS="cleanDEV123456!@#"<br />)

[//]: # (DB_NAME="magovernance"<br />)

[//]: # (DB_PORT="3306"<br />)

[//]: # (APP_SECRET="20clean-farm-app20-devops"<br />)

[//]: # (BASE_URL_FRONT="https://treineaqui.cleandev.com.br/" <br />)

[//]: # (EMAIL_USER="cleandev.contato@gmail.com"<br />)

[//]: # (EMAIL_PASS="facilita#2020"<br />)

[//]: # (CRON_TIMER="0 0 6 * * 1-5"<br />)

[//]: # (EMAIL_NOTIFICA="danilocesarmendes@gmail.com; breno14mota@gmail.com"<br />)



#### ❗ Instale as dependências
Você pode usar o yarn com o comando ```yarn``` ou pode usar o npm com ```npm i```

#### 🚩 Execute a aplicação em modo de desenvolvimento
Se estiver usando yarn basta rodar:
```shell 
yarn dev 
```
Caso use o npm basta rodar: 
```shell
npm run start:dev
```

#### 🖥️ Configurações do servidor 
 Se todas as cconfigurações citadas a cima foram feitas corretamente você receberar a messagem:

```shell
Server is up and running on: http(s)://{{env.HOST}}:{{env.PORT}}
```

exibindo os valores de configurados no arquivo ``.env``

---

### ☁️ Rodando-o-Back-End-(servidor)

```bash
# Acesse a pasta do projeto no terminal/cmd
$ cd ambiente

# Vá para a pasta ma-governance-api
$ cd ma-governance-api

# Atualize o repositório
$ git pull

# Volte para a pasta ambiente
$ cd ..

# Pare a aplicação docker
$ docker-compose stop ma-governance-api

# Inicie a aplicação novamente com o docker
$ docker-compose up -d ma-governance-api

```

### 🛠-Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
