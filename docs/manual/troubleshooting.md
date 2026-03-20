# Troubleshooting: Resolvendo Problemas

Aqui estão as soluções para os problemas mais comuns relatados no SyncDash.

## 📡 Problemas de Conexão

### 1. "O Video Wall não atualiza quando eu mudo o Excel"
*   **Causa**: O arquivo pode estar bloqueado pelo Excel ou o servidor de arquivos não tem permissão de leitura.
*   **Solução**: Certifique-se de salvar o arquivo e fechá-lo. Verifique se o serviço `dashsync-api` está rodando e logs indicam "File Watcher triggered".

### 2. "Tablet e Video Wall estão fora de sincronia"
*   **Causa**: Conexão WebSocket interrompida.
*   **Solução**: Recarregue a página no Tablet e no Wall. Verifique se o símbolo de rede no topo da tela está verde. Em redes corporativas, certifique-se que o protocolo `WSS` não está sendo bloqueado pelo Proxy.

## 📊 Problemas de Dados

### 3. "Gráfico da Curva S está aparecendo vazio"
*   **Causa**: Formato de data inválido na Base02.xlsx ou nomes de colunas alterados.
*   **Solução**: Verifique se as datas estão no formato `DD/MM/AAAA` e não há fórmulas retornando `#DIV/0!`.

### 4. "IA retornando erro 'Key Error'"
*   **Causa**: Falha na chave `ANTHROPIC_API_KEY` ou limite de cota atingido.
*   **Solução**: Verifique o arquivo `.env` e consulte o painel da Anthropic para créditos de API.

---

## 📞 Contato e Suporte
Se o problema persistir:
- **E-mail**: suporte-ti@matrixenergia.local
- **Ramal**: 9988
