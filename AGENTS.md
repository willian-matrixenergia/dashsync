# AGENTS.md - SDD Manifesto

Este projeto utiliza **Spec-Driven Development (SDD)** como metodologia central de desenvolvimento. 

## Princípios Fundamentais

1. **Especificação Primeiro**: Antes de qualquer linha de código ser escrita ou alterada, a funcionalidade deve estar claramente definida em `specs/01-spec.md`.
2. **Plano de Voo**: O agente deve gerar e o usuário deve aprovar um plano técnico em `specs/02-plan.md` antes da implementação.
3. **Leitura Obrigatória**: O agente deve SEMPRE ler as especificações relevantes no diretório `specs/` antes de iniciar qualquer tarefa de codificação.
4. **Governança Estrutural**: Mudanças na arquitetura, modelagem de dados ou componentes core exigem aprovação explícita do usuário.

## Fluxo de Trabalho

`01-spec.md` (O Quê) → `02-plan.md` (Como) → `03-tasks.md` (Passos) → Implementação e Testes.

---

## Regras Globais para Todos os Agentes

### Idioma — Português Brasil (PT-BR) OBRIGATÓRIO
- Todos os textos visíveis ao usuário (labels, títulos, mensagens, tooltips, placeholders) devem estar em PT-BR
- Comentários de código devem estar em PT-BR
- Nunca exibir texto em inglês na interface final

### UI Components — shadcn/ui OBRIGATÓRIO
O projeto utiliza **shadcn/ui** como biblioteca de componentes. Nenhum agente deve criar markup customizado quando existe um componente shadcn equivalente.

**Workflow obrigatório antes de criar qualquer componente UI:**
1. Verificar componentes instalados: `npx shadcn@latest info`
2. Pesquisar se existe o componente: `npx shadcn@latest search`
3. Consultar documentação: `npx shadcn@latest docs <component>`
4. Instalar se necessário: `npx shadcn@latest add <component>`

**Regras de estilo:**
- Cores semânticas (`bg-primary`, `text-muted-foreground`) — nunca valores raw
- `cn()` para classes condicionais
- `gap-*` para espaçamento (nunca `space-x-*` / `space-y-*`)
- `size-*` quando width = height

**Config do projeto:** `components.json` na raiz — style `base-nova`, alias `@/components/ui`, ícones `lucide-react`.
