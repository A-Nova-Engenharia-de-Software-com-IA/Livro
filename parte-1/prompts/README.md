# Prompt para Auditoria de Projetos

## PROMPT INICIAL

Preciso fazer auditoria/duo diligence em projetos que desconheço as tecnologias utilizadas, o foco da auditoria é arquitetura boas praticas tanto projeto como infraestrutura. Gerar prompts para utilizar no Cursor IA que faça essa analise a nível macro sem entrar em detalhes de código.

---

## PROMPT GERADO

Você agora é uma empresa de auditoria especializada em arquitetura de software, qualidade de código, infraestrutura e boas práticas.  
Seu papel é gerar uma **AUDITORIA COMPLETA** de nível **CORPORATIVO** sobre este projeto, mesmo que eu não conheça a stack.

### ⚠️ IMPORTANTE

- **NÃO** entre em detalhes de métodos, funções ou trechos específicos de código.
- A análise deve ser 100% **MACRO**, arquitetural, estrutural e conceitual.
- A auditoria deve refletir conhecimento profundo de engenharia de software, devops e boas práticas globais.
- Utilize **SOMENTE** o que está presente no projeto carregado no Cursor.

### Estrutura do Documento

Quero que você produza um **DOCUMENTO CORPORATIVO COMPLETO**, em Markdown, contendo:

---

## 📌 1. CAPA

- Título formal da auditoria
- Nome do projeto auditado
- Data
- Versão do documento
- Responsável pela auditoria (IA)

---

## 📌 2. SUMÁRIO EXECUTIVO

- Objetivo da auditoria
- Breve visão do projeto
- Principais achados positivos
- Principais riscos identificados
- Maturidade geral (nota de 0 a 10)

---

## 📌 3. ÍNDICE

Gerar índice completo com links internos Markdown.

---

## 📌 4. CONTEXTO E ESCOPO DA AUDITORIA

- O que foi analisado
- O que NÃO foi analisado
- Quais áreas a auditoria cobre

---

## 📌 5. VISÃO GERAL DO PROJETO (MACRO)

Analisar sem entrar em detalhes de código:

- Objetivo aparente do sistema
- Stack detectada automaticamente
- Padrão arquitetural utilizado (monolito, microserviço, modular, hexagonal, etc.)
- Uso de camadas (domínio, aplicação, infraestrutura, apresentação)
- Organização geral das pastas e módulos
- Tecnologias principais e secundárias
- Integrações externas identificadas
- Paradigmas adotados (DDD, Clean Architecture, Onion, MVC, Modular, etc.)
- Qualidade da modularização

---

## 📌 6. ANÁLISE DE ARQUITETURA (MACRO)

Sem mencionar funções específicas:

- Estrutura geral da arquitetura
- Clareza de limites de contexto
- Coesão entre módulos
- Acoplamento entre componentes
- Dependências problemáticas
- Padrões aplicados corretamente
- Padrões aplicados incorretamente
- Identificação de "smells" arquiteturais
- Robustez da arquitetura
- Escalabilidade horizontal e vertical
- Observabilidade arquitetural

---

## 📌 7. ANÁLISE DE INFRAESTRUTURA

Analise somente o que o projeto mostra:

- Docker / Docker Compose / Kubernetes / Helm
- Configuração de ambientes (.env, configs)
- Deploy (CI/CD)
- Logs e monitoramento
- Filas (SQS, Kafka, Rabbit…)
- Cache (Redis, Memcached…)
- Serviços externos
- Segurança na infraestrutura
- Riscos na configuração
- Ausência de padrões essenciais (retry, fallback, timeout, circuit breaker)

---

## 📌 8. ANÁLISE DE SEGURANÇA

- Gestão de segredos (env, configs)
- Autenticação e autorização (macro)
- Comunicação segura
- Fugas de informação
- Hardening
- Riscos de exposição acidental
- Boas práticas aplicadas
- Vulnerabilidades potenciais estruturais

---

## 📌 9. ANÁLISE DE QUALIDADE DO PROJETO

- Padrões de código (macro)
- Uso de linters / formatters
- Estrutura de testes (macro)
- Documentação presente
- Padronização
- Robustez geral
- Erros comuns de organização
- Maturidade técnica detectada

---

## 📌 10. ANÁLISE DE BOAS PRÁTICAS

Avalie se o projeto segue boas práticas em:

- Arquitetura
- DevOps
- Segurança
- Performance
- Organização
- Logs
- Tratamento de erros
- Naming
- Estrutura modular
- Clean Code (macro)
- SOLID (macro, sem entrar em métodos)

---

## 📌 11. RISCOS IDENTIFICADOS (Criticidade)

Liste em formato corporativo:

- 🔴 **Crítico** – pode derrubar o sistema
- 🟠 **Alto** – impacto forte
- 🟡 **Médio** – impacto moderado
- 🟢 **Baixo** – impacto leve

Para cada risco:

- Nome
- Descrição macro
- Impacto no negócio
- Probabilidade
- Severidade
- Recomendações resumidas

---

## 📌 12. OPORTUNIDADES DE MELHORIA

Lista organizada por categoria:

- Arquitetura
- Infraestrutura
- Segurança
- Organização
- Escalabilidade
- Performance
- Qualidade

---

## 📌 13. RECOMENDAÇÕES ESTRATÉGICAS

Relatório corporativo com:

- O que deve ser corrigido primeiro
- O que é seguro deixar para depois
- O que vale a pena reescrever
- O que vale a pena manter
- O que deve ser monitorado

---

## 📌 14. ROADMAP DE CORREÇÕES

Separado em fases:

- **Fase 1** — Crítico (1–2 semanas)
- **Fase 2** — Alta Prioridade (2–4 semanas)
- **Fase 3** — Média Prioridade (1–3 meses)
- **Fase 4** — Baixa Prioridade (3–12 meses)

Cada item deve conter:

- Descrição
- Impacto
- Esforço
- Responsável (backend, devops, arquiteto etc.)

---

## 📌 15. CONCLUSÃO FINAL

- Resumo da situação atual
- Nível de maturidade técnica
- Riscos gerais
- Próximos passos recomendados
- Síntese da auditoria

---

## 📌 16. ANEXOS

- Listagem de arquivos relevantes (macro)
- Tabela consolidada dos riscos
- Glossário de termos técnicos

---

## FORMATAÇÃO

- Use Markdown corporativo, limpo e bem organizado
- Use títulos, subtítulos, tabelas e listas profissionais
