# Base01–04: Guia de Dados Excel

O SyncDash é alimentado por 4 arquivos Excel. A estrutura de colunas deve ser rigorosamente seguida para o funcionamento dos gráficos.

## 📁 Localização
Todos os arquivos devem estar na pasta `./data` do servidor.

## 📄 Base01.xlsx — Portfólio
*   **Aba**: `Projetos`
*   **Colunas Obrigatórias**:
    *   `ID`: Identificador único (ex: PROJ001).
    *   `Nome`: Nome amigável do projeto.
    *   `Criticidade`: Valores aceitáveis: `Baixa`, `Média`, `Alta`, `Crítica`.
    *   `Status`: `Em Andamento`, `Pausado`, `Concluído`.
    *   `Programa`: Categoria do projeto (ex: BESS).

## 📊 Base02.xlsx — Curva S
*   **Aba**: `Progresso`
*   **Colunas Obrigatórias**:
    *   `ProjetoID`: Vinculado ao ID da Base01.
    *   `Data`: Formato `DD/MM/AAAA`.
    *   `Previsto Acumulado`: Valor entre 0 e 100.
    *   `Realizado Acumulado`: Valor entre 0 e 100.

## 📅 Base03.xlsx — Cronograma (Gantt)
*   **Aba**: `Cronograma`
*   **Colunas Obrigatórias**:
    *   `ProjetoID`
    *   `Disciplina`: Engenharia, Suprimentos, Civil, Montagem, etc.
    *   `Inicio`: Data de início.
    *   `Fim`: Data de término.

## 🖼️ Base04.xlsx — Mídias e Câmeras
*   **Aba**: `Midia`
*   **Colunas Obrigatórias**:
    *   `ProjetoID`
    *   `Tipo`: `FOTO`, `VIDEO`, `TOUR_360`.
    *   `Arquivo`: Nome do arquivo na pasta `./media`.
    *   `CameraURL`: URL para o stream ao vivo (opcional).

---

> **Dica**: O SyncDash ignora linhas ocultas no Excel. Use isso para manter dados históricos sem deletar.
