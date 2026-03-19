# Plano de Ação: Corrigir 401 Unauthorized na Vercel

## O Problema (Raiz)
```
Erro: {"error":"Unauthorized","code":"INVALID_API_KEY"}
```

**Causa**: Você está tentando acessar a API sem enviar a chave, ou a chave está incorreta.

**Por que acontece**:
1. A Vercel **não tem** `DASHSYNC_API_KEY` configurada nas variáveis de ambiente
2. Em dev mode (sem chave), o middleware aceita qualquer requisição
3. Mas você está em **produção** na Vercel, então precisa configurar

---

## Solução em 3 Passos

### ✅ Passo 1: Gerar uma Chave Segura

Execute no seu terminal local:
```bash
node -e "console.log('KEY_' + require('crypto').randomBytes(32).toString('hex'))"
```

**Resultado esperado**:
```
KEY_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...
```

Copie esse valor (será uma string aleatória longa).

---

### ✅ Passo 2: Configurar na Vercel Dashboard

1. Acesse https://vercel.com/dashboard
2. Clique no projeto **dashsync**
3. Vá para **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Preenccha o formulário:
   ```
   Name:  DASHSYNC_API_KEY
   Value: KEY_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6... (cole o valor gerado)
   ```
6. Selecione os ambientes:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
7. Clique em **Add**

8. **IMPORTANTE**: Faça um novo deploy:
   - Acesse **Deployments** → clique o menu (⋮) do último deploy → **Redeploy**
   - Aguarde terminar (verde)

---

### ✅ Passo 3: Testar a Requisição

Agora envie requisições com a chave no header:

**opção A: curl**
```bash
curl -H "X-Api-Key: KEY_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..." \
     https://dashsync-api.vercel.app/api/projetos
```

**Opção B: JavaScript/fetch**
```javascript
const response = await fetch('https://dashsync-api.vercel.app/api/projetos', {
  headers: {
    'X-Api-Key': 'KEY_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...'
  }
});
```

**Opção C: Query parameter** (alternativo)
```bash
curl https://dashsync-api.vercel.app/api/projetos?api_key=KEY_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...
```

---

## Verificar se Funcionou

✅ **Sucesso**: Status 200 ou 400 (erro da rota, não de autenticação)
❌ **Falha**: Status 401 ainda → repita o passo 2

---

## Outras Variáveis (Opcional)

Se usar Claude API:
```
ANTHROPIC_API_KEY=sk-ant-v1-... (obtenha em https://console.anthropic.com)
```

Se usar CORS customizado:
```
ALLOWED_ORIGINS=https://seu-dominio.com,https://outro-dominio.com
```

---

## Checklist

- [ ] Gerei chave aleatória com `node -e "..."`
- [ ] Configurei `DASHSYNC_API_KEY` na Vercel Dashboard
- [ ] Selecionei Production + Preview + Development
- [ ] Fiz redeploy da aplicação na Vercel
- [ ] Testei com `curl -H "X-Api-Key: <sua-chave>"`
- [ ] Obtive resposta 200 ou 400 (não 401)

---

## Se Ainda Não Funcionar

1. **Verifique o URL de deploy**:
   ```bash
   git remote -v | grep origin
   ```
   Confirme que está no repo correto.

2. **Verifique os logs da Vercel**:
   - Dashboard → Deployments → Clique no deploy → **Logs**
   - Procure por `DASHSYNC_API_KEY is not set`

3. **Limpe cache local**:
   ```bash
   # Windows: Ctrl+Shift+Delete ou use incognito
   # Mac: Cmd+Shift+Delete ou use private window
   # Linux: Ctrl+Shift+Delete
   ```

4. **Teste em dev local**:
   ```bash
   pnpm --filter @dashsync/api dev
   curl -H "X-Api-Key: qualquer-coisa" http://localhost:3001/api/projetos
   # Em dev sem DASHSYNC_API_KEY, aceita qualquer chave
   ```

---

## Próximos Passos (Engineering)

Após confirmar que funciona:
1. Implemente o PRD-SERVERLESS-AUTH.md para maior robustez
2. Adicione `DASHSYNC_API_KEY` ao arquivo de secrets do Time
3. Configure alertas se alguém tentar deploy sem a chave

