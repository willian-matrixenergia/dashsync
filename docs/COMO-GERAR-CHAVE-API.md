# Como Gerar a Chave da API (DASHSYNC_API_KEY)

## O que é a chave?
É uma **senha secreta** aleatória que protege sua API. Sem ela, qualquer pessoa poderia acessar seus dados.

Exemplo de chave válida:
```
KEY_a3f92b8c1e4d7f2c9b5e8a1d4c7f2e5b8a1d4c7f2e5b8a1d4c7f2e5b8a1d
```

---

## Opção 1: Terminal (Recomendado - Mais Seguro)

### No Windows (Command Prompt ou PowerShell):
```cmd
node -e "console.log('KEY_' + require('crypto').randomBytes(32).toString('hex'))"
```

### No Mac/Linux (Terminal):
```bash
node -e "console.log('KEY_' + require('crypto').randomBytes(32).toString('hex'))"
```

**Resultado**: Uma linha gigante com 32 caracteres aleatórios
```
KEY_f7a3c9e2b1d8f4a6c9e2b1d8f4a6c9e2b1d8f4a6c9e2b1d8f4a6c9e2b1d8f4
```

Copie inteiro (incluindo `KEY_`).

---

## Opção 2: Online (Mais Fácil - Menos Seguro)

Se não conseguir rodar o comando, use um gerador online:

### Para Windows:
1. Abra https://www.uuidgenerator.net/
2. Clique em "Generate" algumas vezes
3. Copie o resultado e adicione `KEY_` na frente

**Exemplo**:
```
UUID gerado: f7a3c9e2-b1d8-f4a6-c9e2-b1d8f4a6c9e2
Sua chave: KEY_f7a3c9e2b1d8f4a6c9e2b1d8f4a6c9e2
```

---

## Opção 3: Criar Manualmente (Não Recomendado)

Se nenhuma das opções acima funcionar, crie uma chave digitando:

```
KEY_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
```

**Mínimo**: 32 caracteres (letras + números)

Exemplo válido:
```
KEY_MySecurePassword123456789012345
```

---

## O Que Significa Cada Parte

```
node -e "console.log('KEY_' + require('crypto').randomBytes(32).toString('hex'))"
│     │  │           │      └─ Gera 32 números aleatórios
│     │  │           └─ Converte para texto hexadecimal (0-9, a-f)
│     │  └─ Importa a biblioteca de criptografia do Node.js
│     └─ Executa JavaScript no terminal
└─ Programa que você usará
```

### Tradução simples:
- `randomBytes(32)` = 32 números completamente aleatórios
- `toString('hex')` = Converte em letras e números legíveis
- `'KEY_' +` = Adiciona o prefixo `KEY_` no começo

**Resultado**: Uma string impossível de adivinhar! ✅

---

## Checklist

- [ ] Executei o comando `node -e "..."`
- [ ] Copiei todo o resultado (incluindo `KEY_`)
- [ ] Passei para a Vercel Dashboard
- [ ] Testei com `curl -H "X-Api-Key: <sua-chave>" https://...`

---

## Erros Comuns

### Erro: "command not found: node"
**Solução**: Instale Node.js em https://nodejs.org/

### Erro: Copiei só metade da chave
**Solução**: Copie do começo (`KEY_`) até o final, sem deixar nada para trás

### Erro: "Invalid API Key" mesmo com chave correta
**Solução**: Verifique se:
1. Você fez **redeploy** na Vercel após adicionar a variável
2. Está enviando a chave no header correto: `X-Api-Key: ...`
3. Não há espaços extras antes/depois da chave

---

## Segurança: Importante!

⚠️ **NUNCA compartilhe sua chave**:
- ❌ Não coloque em código (GitHub, arquivos locais)
- ❌ Não envie por email ou chat
- ❌ Não deixe na tela durante reuniões
- ✅ Guarde só na Vercel Dashboard

Se alguém vir sua chave:
```bash
# Gere uma nova e atualize na Vercel
node -e "console.log('KEY_' + require('crypto').randomBytes(32).toString('hex'))"
```

