# Cozy Chat

Um chat em tempo real via WebSocket para uso local em rede, ideal para aulas e conversas informais. Sem banco de dados — nada é salvo, garantindo privacidade total.

## Como funciona

- **Servidor Node.js** com Express + Socket.IO gerencia as conexões em tempo real
- **Frontend React** com TypeScript, Tailwind CSS e DaisyUI
- Toda mensagem, usuário e reação ficam **apenas em memória** — ao desligar o servidor, tudo é apagado
- Suporte a reações com emoji, respostas a mensagens, indicador de digitação e lista de usuários online
- Sistema de admin com comandos (`/kick`, `/mute`, `/clearall`)
- 32 temas visuais (light, dark, dracula, etc.) com persistência no navegador
- Interface em português brasileiro

## Executando o projeto

### 1. Inicie o servidor

```bash
cd server
npm install
npm start
```

O servidor ficará disponível em `http://0.0.0.0:3001`.

### 2. Inicie o frontend (desenvolvimento)

```bash
npm install
npm run dev
```

Acesse `http://localhost:8080`.

### Produção (servidor único)

```bash
npm run build
cd server
npm start
```

O servidor serve o build React diretamente em `http://<seu-ip>:3001`.

## Expondo para outras redes (ngrok)

Para que pessoas fora da sua rede local acessem o chat, use o [ngrok](https://ngrok.com):

```bash
ngrok http 3001
```

Isso gera um endereço público (ex: `https://abc123.ngrok.io`) que você pode compartilhar. **Importante:** enquanto seu computador estiver desligado ou o servidor parado, o chat fica indisponível — tudo roda na sua máquina.

## Credenciais de admin

- **Usuário:** `Zee`
- **Senha:** `User0660`

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `/help` | Lista todos os comandos |
| `/clear` | Limpa mensagens locais |
| `/nick <nome>` | Altera seu nome |
| `/kick <usuário>` | Remove um usuário (admin) |
| `/mute <usuário>` | Silencia um usuário (admin) |
| `/unmute <usuário>` | Remove silêncio (admin) |
| `/clearall` | Limpa todas as mensagens (admin) |
