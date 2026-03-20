# Guia do Coordenador de Obra / Dados

Como Coordenador, seu "Job-to-be-Done" principal é garantir que a **verdade de campo** esteja refletida no dashboard semanalmente.

## 📥 Como atualizar os dados?

O SyncDash consome 4 arquivos Excel principais localizados na pasta `./data`.

### 1. Portfólio (Base01.xlsx)
*   **O que contém**: Lista de projetos, KPIs de cronograma, custo e segurança.
*   **Frequência**: Semanal (toda segunda-feira até as 09h).
*   **Dica**: A coluna "Criticidade" define a cor do card no Video Wall (Verde/Amarelo/Vermelho).

### 2. Avanço Físico (Base02.xlsx)
*   **O que contém**: Séries temporais para a **Curva S**.
*   **Colunas Chave**: `Data`, `Planejado (%)`, `Realizado (%)`.
*   **Visualização**: Alimenta a Screen 02 do Video Wall.

### 3. Cronograma (Base03.xlsx)
*   **O que contém**: Datas de início e fim por disciplina (Engenharia, Suprimentos, Civil, etc).
*   **Visualização**: Gera o gráfico de Gantt na Screen 01.

### 4. Mídias (Base04.xlsx)
*   **O que contém**: Links para fotos, vídeos e tours 360°.
*   **Importante**: As fotos devem ser salvas na pasta `./media` seguindo a nomenclatura definida na planilha.

## 📸 Upload de Fotos e Vídeos
1.  Renomeie os arquivos conforme o ID do projeto (ex: `PROJ001_FOTO01.jpg`).
2.  Mova os arquivos para a subpasta do projeto dentro de `./media`.
3.  O sistema detectará as novas mídias automaticamente.

## 💡 Melhores Práticas
- **Evite células vazias**: Preencha com `0` ou `N/A` para evitar quebras nos gráficos.
- **Validação**: Após salvar, olhe para o Video Wall. Se o card piscar em vermelho, há um erro de formatação na sua planilha.
