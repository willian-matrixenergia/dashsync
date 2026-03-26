# Claude AI: O Cérebro do SyncDash

O SyncDash integra o modelo **Claude 3.5 Sonnet** (Anthropic) para transformar dados brutos em decisões estratégicas.

## 🤖 O que a IA faz?

### 1. Auditoria de Risco Automática
Ao analisar a Curva S (Base02) e o Cronograma (Base03), a IA identifica desvios de tendência. Se o "Realizado" estiver desconectado do "Planejado" com uma tendência de queda, o sistema alertará sobre risco de atraso em marcos críticos.

### 2. Sumário Executivo em Português
A IA gera um briefing semanal pronto para leitura:
- **Status Geral**: "O projeto PROJ001 está 5% à frente do cronograma físico."
- **Pontos de Atenção**: "A disciplina de Civil iniciou com atraso de 3 dias."

### 3. Filtro em Linguagem Natural
Você pode digitar ou falar no Tablet: *"Quais projetos de BESS estão críticos?"*. A IA traduz isso em um filtro estruturado para o dashboard.

## ⚙️ Configuração
Para que estas funções funcionem, a variável `ANTHROPIC_API_KEY` deve estar ativa no servidor. Caso contrário, os ícones de IA aparecerão desabilitados ou retornarão mensagens de erro.

---

> **Aviso**: A IA é uma ferramenta de apoio. Sempre valide as informações geradas com as equipes de campo antes de tomar decisões críticas de orçamento.
