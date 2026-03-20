# AGENTS.md - SDD Manifesto

Este projeto utiliza **Spec-Driven Development (SDD)** como metodologia central de desenvolvimento. 

## Princípios Fundamentais

1. **Especificação Primeiro**: Antes de qualquer linha de código ser escrita ou alterada, a funcionalidade deve estar claramente definida em `specs/01-spec.md`.
2. **Plano de Voo**: O agente deve gerar e o usuário deve aprovar um plano técnico em `specs/02-plan.md` antes da implementação.
3. **Leitura Obrigatória**: O agente deve SEMPRE ler as especificações relevantes no diretório `specs/` antes de iniciar qualquer tarefa de codificação.
4. **Governança Estrutural**: Mudanças na arquitetura, modelagem de dados ou componentes core exigem aprovação explícita do usuário.

## Fluxo de Trabalho

`01-spec.md` (O Quê) → `02-plan.md` (Como) → `03-tasks.md` (Passos) → Implementação e Testes.
