# Spec: Alinhamento de Interface (Stitch + Matrix Brand)

## Visão Geral
Este documento especifica a reestruturação visual do SyncDash para espelhar os designs aprovados no Stitch (Projeto #17883482064693094986) e garantir conformidade total com o Manual de Marca Matrix.

## Requisitos de Design
- **Tipografia**: Substituir fontes do sistema por `Lexend` (Google Fonts).
- **Cores**: 
    - Fundo Principal: Grafite Matrix (#151B1C).
    - Elementos de Interação/Destaque: Laranja Matrix (#FF4A00).
    - Superfícies/Cards: Off-white (#F1F3F0) ou Grafite (#151B1C) com bordas suaves.
- **Ícones**: Glyph icons monocromáticos e arredondados.

## Mapeamento de Telas (Stitch -> Código)
1. **Home / Matrix Energia Pure Light**: `src/components/KPICards.tsx` e visão geral do projeto.
2. **Portfolio Management**: `src/components/Dashboard.tsx` e `src/components/ProjectTable.tsx`.
3. **Phases & Progress**: `src/components/Screen2.tsx` (Curva S, MOD).
4. **Photographs & Videos**: `src/components/Screen3.tsx` (Galeria de Mídia).
5. **Real-time Monitoring**: `src/components/Screen4.tsx` (Monitoramento de Campo).

## Critérios de Aceite
- [ ] O logo da Matrix deve seguir as regras de aplicação (não distorcer, versões positivas/negativas corretas).
- [ ] Todas as telas devem usar a fonte `Lexend`.
- [ ] O contraste deve ser acessível, usando a paleta oficial.
- [ ] A navegação deve refletir a estrutura encontrada no Stitch.
