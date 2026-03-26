# 01b-login-spec.md - SyncDash Login Screen Spec

## Objetivo
Definir a estrutura, layout e regras de negócio da nova tela de Login da aplicação SyncDash.

## 1. Regras de Negócio
- **Autenticação Dupla**: Suporte a Email/Senha (Credentials) e Social Login (Google).
- **Restrição de Domínio**: O acesso só será permitido para emails com domínio `@matrixenergia.com`. Qualquer pessoa de outro domínio terá o login bloqueado.
- **Solicitação de Acesso**: Inclusão de um link na UI (ex: mailto) para novos usuários solicitarem acesso.

## 2. Design Tokens
- Segue a paleta da Matrix: Laranja Matrix (`#FF4A00`), Grafite Matrix (`#151B1C`) e Off-white.
- Tipografia base: `Lexend`.

## 3. Especificação Visual (Layout)
*   **Background**: `min-h-screen`, `bg-background` mantendo o ruído visual abstrato para profundidade (`bg-noise`).
*   **Caixa de Login (Card)**:
    *   **Logo Matrix** no topo (SVG negativo).
    *   **Header**: Título "Dashboard Executivo" e descrição "Acesso restrito".
    *   **Formulário (Email/Senha)**:
        *   Input de Email (`type="email"`).
        *   Input de Senha (`type="password"`).
        *   Botão "Entrar" (cor Primária).
    *   **Divisor**: `<hr />` + "ou" + `<hr />`.
    *   **Login Social**: Botão "Entrar com Google" (Outline ou cinza secundário).
    *   **Rodapé**: Link sutil (text-sm, muted) "Solicitar acesso".

## 4. Comportamentos e Edge Cases
*   **Erro de Domínio**: Caso o usuário use Google com um e-mail diferente de `@matrixenergia.com`, o sistema deve barrar e exibir mensagem "Apenas contas corporativas Matrix são aceitas".
*   **Credenciais incorretas**: Tratamento padrão de erro "Usuário ou senha incorretos."
*   **Feedback Visual (Loading)**: Botão de login altera texto ou ganha spinner durante o processo de auth.
