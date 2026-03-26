# Especificação: Suporte a Tema Claro/Escuro (Theme Toggle)

## 1. Visão Geral
O SyncDash da Matrix Energia precisa apresentar flexibilidade visual ergonômica, oferecendo, de forma robusta e nativa, suporte aos modos de exibição "Dark Mode" (Escuro) e "Light Mode" (Claro). A interface deve adaptar toda sua hierarquia de cores para não agredir a vista dos operadores em diferentes condições de iluminação, preservando inteiramente a assinatura visual da marca.

## 2. Requisitos de Negócio (O Quê)
1. **Auto-detecção (System Preference):** Ao acessar o SyncDash pela primeira vez, o sistema deve ler a configuração do sistema operacional do dispositivo do usuário (`prefers-color-scheme`) e definir o tema correspondente atomaticamente.
2. **Toggle Manual:** O cabeçalho superior direito (`HomeClient.tsx`) deve exibir um controle visual limpo (como um ícone Sol/Lua) permitindo que o usuário sobreponha a detecção automática e force o seu tema preferido a qualquer instante (Claro, Escuro, Sistema).
3. **Persistência Temporária:** A escolha manual feita via toggle deve ser lembrada nas sessões futuras armazenando a preferência no Local Storage.
4. **Fidelidade da Marca (Brand Compliance):** Tanto no "Light" quanto no "Dark" a cor Laranja Matrix (`#FF6B00`) deve predominar como chamativa (cor `Primary`). No tema base Escuro, usa-se a paleta Black/Silver/Panel; no Claro, os fundos migram para brancos e cinzas pálidos, mantendo a leitura hierárquica clara.

## 3. Diretrizes Técnicas (Como)
- **Integração de Biblioteca:** Utilizar a biblioteca `next-themes`, que é a escolha de referência utilizada junto ao ecossistema Next.js e *shadcn/ui*, para inibir flicakering/piscar de temas no carregamento server-side.
- **Provider de Tema:** Integrar o `<ThemeProvider attribute="class" defaultTheme="system" enableSystem />` na hierarquia raiz da aplicação (provavelmente `app/layout.tsx`).
- **Componente de Toggle:** Criar ou instanciar o componente `components/ui/theme-toggle.tsx` contendo um Menu Dropdown Shadcn para as 3 opções (Light, Dark, System).
- **CSS Variáveis no globals.css:** Revisar as variáveis `:root` e `.dark` para contemplar as cores exatas descritas nos mockups antigos ou nas diretrizes brand book, mapeando cores semânticas como `--background`, `--foreground`, `--card`, `--primary`, para cada estado.
- **Logos Sensíveis ao Tema:** Garantir que elementos como `logo-matrix.svg` possuam contraste adequado ou, se necessário, possuam preenchimento variável baseada na flag css `.dark`.

## 4. Critérios de Aceite
- [ ] O usuário consegue visualizar um ícone amigável no menu do topo para gerenciar o modo de cor.
- [ ] Dispositivos com "Modo Escuro" nativo configurado abrirão o Dashboard no modo Escuro por padrão.
- [ ] A alternância manual do tema aplica as alterações de cor instantaneamente a *todos os módulos operacionais* na tela sem necessidade de dar *refresh* de página.
- [ ] A cor "Primary" para textos de destaque e preenchimentos nas barras de progresso (Módulo Comercial/GD) segue intacta de forma vibrante para ambos os modos.
- [ ] A aba selecionada no carrossel de abas adapta seu background hover fluidamente entre o cinza claro e o cinza escuro.
