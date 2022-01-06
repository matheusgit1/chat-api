# CHAT API
## Apêndice

Este software é de licença livre para qualquer um que queira utilizar em seus projetos

este é um projeto de chat real time usando nodaJs, mongoDB, socket-io e outra tecnologias.
Baixe o source, clone, adapte, use e melhore como quiser. 


feito com |`:sparkling_heart:`| por um dev para outros devs


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

MONGO_URL = seu endereço mongo DB

JWT_SEC = sua chave de criptografia jwt

dentro da pasta `utils`, modifique `mailConfig.json` com suas credencias de serviço de envio de emails




## Documentação da API

## AUTENTICAÇÂO

### CRIAR UMA CONTA

```http
  POST /api/auth/register
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `username` | `string` | **Obrigatório**. |BODY
| `email` | `string` | **Obrigatório**. |BODY
| `password` | `string` | **Obrigatório**. |BODY
| `profilePicture` | `string` | link de foto de perfil.**OPCIONAL**. |BODY
| `coverPicture` | `string` | link alternativo de foto de perfil.**Obrigatório**. |BODY

requisição/resposta

![auth 1](https://github.com/matheusgit1/chat-api/blob/main/api-preview/auth/register.PNG)


### LOGIN

```http
  POST /api/auth/login
```
| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `email` | `string` | **Obrigatório**. |BODY
| `password` | `string` | **Obrigatório**. |BODY

requisição/resposta

![auth 2](https://github.com/matheusgit1/chat-api/blob/main/api-preview/auth/login.PNG)

#### ACESSTOKEN

use o campo `acessToken` do retornao de login para trabalhar dentro das rotas autenticadas.

use `token: acessToken` nos headers das requisições.

### RESETAR UMA SENHA

```http
  PUT /api/auth/login
```
| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `email` | `string` | **Obrigatório**. |BODY
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![auth 3](https://github.com/matheusgit1/chat-api/blob/main/api-preview/auth/reset-password.PNG)

em caso de sucesso, um link com o toen de redefinição de senha sera enviado para o usuario.
insira suas credencias de serviço de disparo de emails em `src/utils/mailConfig` e `src/utils/transporter` 


### REDEFINIR UMA SENHA

```http
  PUT /api/auth/change-password/:resete_token
```
| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `email` | `string` | email.**Obrigatório**. |BODY
| `password` | `string` | senha.**Obrigatório**. | BODY
| `confirmPassword` | `string` |confirmação de senha. **Obrigatório**. | BODY
| `resete_token` | `string` |token de redefinição de senha. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![auth 4](https://github.com/matheusgit1/chat-api/blob/main/api-preview/auth/change-password.PNG)

### DELETAR UM USUARIO

```http
  DEL /api/auth/delete/:id
```
| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `password` | `string` | senha.**Obrigatório**. | BODY
| `id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![auth 5](https://github.com/matheusgit1/chat-api/blob/main/api-preview/auth/delete%20user.PNG)


## USUARIOS

### RECUPERAR DADOS DE UM USUARIO

```http
  GET /api/users/
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![user 1](https://github.com/matheusgit1/chat-api/blob/main/api-preview/user/get%20user.PNG)

### RECUPERAR LISTA DE AMIGOS UM USUARIO

```http
  GET /api/users/friends/:id
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![user 2](https://github.com/matheusgit1/chat-api/blob/main/api-preview/user/get%20friend%20list.PNG)

### SEGUIR UM USUARIO

```http
  PUT /api/users/:id/follow
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de usuario a ser seguido. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![user 3](https://github.com/matheusgit1/chat-api/blob/main/api-preview/user/follow%20a%20user.PNG)

### DEIXAR DE SEGUIR UM USUARIO

```http
  PUT /api/users/:id/unfollow
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de usuario a deixar de ser seguido. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![user 4](https://github.com/matheusgit1/chat-api/blob/main/api-preview/user/unfollow%20user.PNG)

### DELETAR UM USUARIO

```http
  DEL /api/users/delete/:id
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![user 5](https://github.com/matheusgit1/chat-api/blob/main/api-preview/user/delete%20a%20user.PNG)

### ATUALIZAR UM USUARIO

```http
  PUT /api/users/update/:id
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers
| `username` | `string` | **OPCIONAL**. |BODY
| `email` | `string` | **OPCIONAL**. |BODY
| `password` | `string` | **OPCIONAL**. |BODY
| `profilePicture` | `string` | link de foto de perfil.**OPCIONAL**. |BODY
| `coverPicture` | `string` | link alternativo de foto de perfil.**Obrigatório**. |BODY

requisição/resposta

![user 6](https://github.com/matheusgit1/chat-api/blob/main/api-preview/user/update%20a%20user.PNG)


## CONVERSAS

### CRIAR UMA CONVERSA

```http
  POST /api/conversations/
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `name` | `string` | caso seja uma conversa em grupo.**OBRIGATÓRIO**. |BODY
| `name` | `string` | caso seja uma conversa entre dois usuarios.**OPCIONAL**. |BODY
| `membersId` | `ARRAY` | array com id's de cada usuario a serem inseridos na conversa.**Obrigatório**. |BODY
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![cvs 1](https://github.com/matheusgit1/chat-api/blob/main/api-preview/conversations/new%20converastion.PNG)

### RECUPERAR CONVERSAS DE UM USUARIO

```http
  GET /api/conversations/:id
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![cvs 2](https://github.com/matheusgit1/chat-api/blob/main/api-preview/conversations/get%20conversation%20off%20user.PNG)


### RECUPERAR CONVERSAS ENTRE USUARIOS

```http
  GET /api/conversations/:user_id/:another_user_id
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `user_id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `another_user_id` | `string` |id de segundo usuario. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![cvs 3](https://github.com/matheusgit1/chat-api/blob/main/api-preview/conversations/commun%20conversation%20with%20other%20user.PNG)


### DELETAR UMA CONVERSA

```http
  DEL /api/conversations/delete/:user_id/:convrsation_id
```

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `user_id` | `string` |id de usuario. **Obrigatório**. | parametro da url
| `convrsation_id` | `string` |id de conversa. **Obrigatório**. | parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![cvs 4](https://github.com/matheusgit1/chat-api/blob/main/api-preview/conversations/delete%20conversation.PNG)


## MENSSAGENS
### ENVIAR UMA MENSAGEM A UMA CONVERSA

```http
  POST /api/messages/
```

"conversationId":"61d63c6dcb04be143030c4fc",
	"sender":"username",
	"text":"message test"

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `conversationId` | `string` |id de conversa.**Obrigatório**. |BODY
| `sender` | `string` | nome de usuario.**Obrigatório**. |BODY
| `text` | `string` | menssasgem.**Obrigatório**. |BODY
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![msg 1](https://github.com/matheusgit1/chat-api/blob/main/api-preview/messages/send%20message.PNG)


### RECUPERAR MENSAGENS DE UMA CONVERSA

```http
  GET /api/messages/:id
```

"conversationId":"61d63c6dcb04be143030c4fc",
	"sender":"username",
	"text":"message test"

| Parâmetro   | Tipo       | Descrição  |                           |
| :---------- | :--------- | :--------- |:---------
| `id` | `string` |id de conversa.**Obrigatório**. |parametro da url
| `token` | `string` | token de acesso do usuario.**Obrigatório**. | headers

requisição/resposta

![msg 2](https://github.com/matheusgit1/chat-api/blob/main/api-preview/messages/get%20a%20messages%20chat.PNG)

## Autores
### MATHEUS ALVES PEREIRA
- [github](https://github.com/matheusgit1)
- [linkekin](https://www.linkedin.com/in/matheus-alves-pereira-4b3781222/)
- [instagram](https://www.instagram.com/ap_matheus/)



