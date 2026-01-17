# Avaliação Textual de Agentes de IA

## O que é Avaliação Textual?

Avaliação textual (Evals) é o processo de medir a qualidade das respostas geradas por agentes de IA. Não basta a resposta "parecer boa" — ela precisa ser **correta, fiel, completa e sem alucinações**.

```
┌────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE AVALIAÇÃO TEXTUAL                      │
└────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
  │ Texto-Fonte  │──────▶│    Agente    │──────▶│   Resposta   │
  │  (Verdade)   │       │     (IA)     │       │   Gerada     │
  └──────────────┘       └──────────────┘       └──────────────┘
                                                       │
                                                       ▼
                         ┌─────────────────────────────────────────┐
                         │           AVALIADORES (EVALS)           │
                         ├─────────────────────────────────────────┤
                         │  🎯 Precisão     → Está correto?        │
                         │  📖 Fidelidade   → É fiel ao fonte?     │
                         │  🔮 Alucinação   → Inventou algo?       │
                         └─────────────────────────────────────────┘
                                                       │
                                                       ▼
                                               ┌──────────────┐
                                               │   SCORES     │
                                               │  0.0 - 1.0   │
                                               └──────────────┘
```

## Por que isso importa?

Em sistemas corporativos — especialmente em **saúde, jurídico, financeiro e auditoria** — alucinações podem gerar:

- ❌ Falhas operacionais
- ❌ Inconsistências de dados
- ❌ Riscos legais
- ❌ Perda de confiança
- ❌ Decisões equivocadas

**Avaliações automáticas são tão importantes quanto testes unitários no desenvolvimento tradicional.**

## Métricas Implementadas

| Métrica                        | O que avalia              | Pergunta-chave            |
| ------------------------------ | ------------------------- | ------------------------- |
| **Precisão (Accuracy)**        | Informações corretas      | Os fatos estão certos?    |
| **Fidelidade (Faithfulness)**  | Representação do contexto | Distorceu algum trecho?   |
| **Alucinação (Hallucination)** | Informações inventadas    | Criou dados inexistentes? |

### Precisão (Accuracy)

Verifica se as informações principais da resposta estão **corretas** em relação ao texto-fonte.

```python
# Texto-fonte: "Empresa fundada em 2016 no Brasil"
# Resposta: "Empresa fundada em 2014 nos EUA"
# Score: 0.0 (datas e país incorretos)
```

### Fidelidade (Faithfulness)

Avalia se o agente **representou corretamente** as informações sem distorcer ou alterar o significado.

```python
# Texto-fonte: "Sistema focado em segurança do paciente"
# Resposta: "Sistema que prioriza redução de custos"
# Score: 0.0 (distorceu o foco da empresa)
```

### Alucinação (Hallucination)

Detecta se o agente **inventou informações** que não existem no texto-fonte.

```python
# Texto-fonte: "Empresa de tecnologia para saúde"
# Resposta: "Empresa que fabrica equipamentos para cirurgias neurológicas"
# Score: 0.0 (inventou produto que não existe no fonte)
```

## Como Funciona

O exemplo usa **LLM-as-a-Judge**: um modelo de IA avalia as respostas de outro agente. Cada avaliador:

1. Recebe o texto-fonte (verdade)
2. Recebe a resposta do agente
3. Analisa seguindo critérios específicos
4. Retorna um score (0-1) com explicação

## Como Rodar

```bash
# 1. Instale as dependências
pip install -r requirements.txt

# 2. Configure sua API key
export OPENAI_API_KEY="sua-chave-aqui"

# 3. Execute o exemplo
python text_eval.py
```

## Estrutura do Exemplo

```
avaliacao-textual/
├── text_eval.py      # Código com os avaliadores
├── requirements.txt  # Dependências
└── README.md         # Esta documentação
```

## Quando Usar Evals?

| Cenário                    | Recomendação   |
| -------------------------- | -------------- |
| RAG corporativo            | ✅ Obrigatório |
| Chatbots de atendimento    | ✅ Recomendado |
| Geração de relatórios      | ✅ Obrigatório |
| Sistemas de saúde/jurídico | ✅ Crítico     |
| Chat casual                | ⚪ Opcional    |

## Expandindo as Avaliações

Outras métricas úteis que podem ser implementadas:

- **Completude**: A resposta cobre todos os pontos essenciais?
- **Relevância**: Respondeu o que foi perguntado?
- **Consistência de tom**: Manteve o nível de formalidade?
- **Alinhamento ao prompt**: Seguiu formato/estrutura pedidos?

## Resumo

| Conceito             | Benefício                           |
| -------------------- | ----------------------------------- |
| Avaliação automática | Detecta problemas antes da produção |
| LLM-as-a-Judge       | Avaliação escalável e consistente   |
| Múltiplas métricas   | Visão completa da qualidade         |
| Scores numéricos     | Monitoramento e alertas             |

**Avaliar agentes de IA é tão importante quanto testá-los — protege seu negócio e seus usuários.**
