# Guia de TI e Administração

Como administrador do SyncDash, seu foco é garantir a disponibilidade dos serviços de WebSocket e a integridade do banco de dados analítico.

## 🏗️ Requisitos de Infraestrutura
- **Node.js**: v20+
- **Docker**: Para instâncias do ClickHouse e containers de produção.
- **Portas**: 
    - `3001` (API / WebSocket)
    - `5173`/`5174` (Frontends Video Wall e Tablet)

## 🔑 Configuração de Segurança (.env)
O arquivo `.env` deve estar configurado corretamente para o funcionamento:
- `WS_SECRET`: Segredo para assinatura de tokens de WebSocket.
- `DASHSYNC_API_KEY`: Chave para endpoints administrativos.
- `ANTHROPIC_API_KEY`: Necessária para as funções de IA (Claude).

## 🩺 Monitoramento de Saúde
Acesse o endpoint `/api/health` para verificar o status:
- Conectividade com ClickHouse.
- Status do watcher de arquivos Excel.
- Latência média das câmeras proxy.

## 🔄 Fluxo de Dados (WebSocket)
O tablet e o video wall se comunicam vis `/ws/control`. Se houver desconexões frequentes:
1.  Verifique firewalls de rede corporativa (permitir portas 3001).
2.  Incremente o tempo de TTL dos tokens se necessário.

---

> **Dica**: Use o comando `npm run admin:reload` via terminal se precisar forçar um recarregamento fora do ciclo automático de 2 segundos.
