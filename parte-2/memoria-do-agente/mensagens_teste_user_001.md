# 🧠 Mensagens de Teste - Sistema de Memória (user_001)

Este arquivo contém uma série de mensagens para testar todas as hierarquias de memória do agente.

**Usuário:** Carlos Silva (user_001)  
**Objetivo:** Gerar dados em todas as camadas de memória

---

## Como Usar

1. Execute o agente: `python memory_agent.py`
2. Selecione o usuário `001` ou `user_001`
3. Envie as mensagens abaixo na ordem indicada
4. Use `/stats` para verificar o estado da memória

---

## 📋 Mensagens (Enviar na Ordem)

### Fase 1: Estabelecendo Contexto Pessoal (Gera Long-term + Vector)

```
1. Olá! Meu nome é Carlos e trabalho como desenvolvedor full-stack há 8 anos.
```

```
2. Atualmente estou focado em projetos com Python e TypeScript, mas também tenho experiência com Go.
```

```
3. Minha stack principal no trabalho é FastAPI no backend e Next.js no frontend.
```

```
4. Prefiro trabalhar de manhã cedo, geralmente começo às 6h antes de todo mundo chegar.
```

```
5. Estou estudando muito sobre inteligência artificial e LLMs nos últimos meses.
```

### Fase 2: Compartilhando Preferências (Gera Long-term: preferences)

```
6. Prefiro documentação técnica direta, sem muita enrolação. Pode ir direto ao ponto comigo.
```

```
7. Gosto de usar o VS Code com a fonte JetBrains Mono e tema Dracula.
```

```
8. Para gerenciamento de projetos, uso Notion para notas pessoais e Linear para tarefas do time.
```

```
9. Meu sistema operacional preferido é macOS, mas também uso Linux em servidores.
```

```
10. Uso muito Docker e Kubernetes no dia a dia. K8s é essencial para nossos deploys.
```

### Fase 3: Perguntas Técnicas (Gera Vector Memory rica)

```
11. Pode me explicar como funciona o padrão de memória de agentes com embeddings?
```

```
12. Qual a diferença entre memória episódica e memória semântica em sistemas de IA?
```

```
13. Como você recomenda estruturar um sistema de RAG para documentação interna?
```

```
14. Estou tendo problemas com rate limiting na API da OpenAI. Alguma sugestão?
```

```
15. Vale a pena usar um vector database como Pinecone ou posso começar com FAISS?
```

### Fase 4: Contexto de Projeto Atual (Mais dados para Vector)

```
16. Estou desenvolvendo um chatbot para nossa empresa que precisa lembrar o histórico do cliente.
```

```
17. O projeto usa PostgreSQL com pgvector para armazenar os embeddings.
```

```
18. Nossa API processa cerca de 10 mil requisições por dia, então performance é crítica.
```

```
19. Implementei um sistema de cache com Redis para reduzir chamadas à OpenAI.
```

```
20. O maior desafio tem sido balancear custo vs qualidade das respostas.
```

### Fase 5: Mais Interações (Ativa Summary Memory - após 20 msgs)

```
21. Como você sugere fazer a poda de memórias antigas sem perder contexto importante?
```

```
22. Existe algum benchmark padrão para avaliar sistemas de memória de agentes?
```

```
23. Estou pensando em implementar um sistema de feedback do usuário para melhorar as respostas.
```

```
24. Você conhece o framework LangChain? Estou avaliando se vale usar ou fazer do zero.
```

```
25. Para produção, é melhor usar gpt-4o-mini ou investir no gpt-4o completo?
```

### Fase 6: Consolidando Memória (Mais contexto)

```
26. Ah, esqueci de mencionar: trabalho na empresa TechCorp, somos uma startup de fintech.
```

```
27. Nossa equipe de desenvolvimento tem 12 pessoas, sendo 4 focados em IA.
```

```
28. O produto principal é um app de gestão financeira pessoal com insights automáticos.
```

```
29. Usamos muito análise de sentimento nas reviews dos usuários.
```

```
30. Nosso próximo milestone é lançar o assistente virtual até março de 2025.
```

---

## 🔍 Verificação das Memórias

Após enviar todas as mensagens, use os comandos:

### Ver Estatísticas

```
/stats
```

Deve mostrar:

- **Short-term:** ~5-10 mensagens (últimas da conversa)
- **Vector:** 25-30 memórias (uma por mensagem do usuário)
- **Resumos:** 1-2 (criados após 20 mensagens)
- **Fatos:** 10-15 fatos extraídos
- **Preferências:** Várias preferências detectadas

### Testar Busca Semântica

Envie estas mensagens para testar a recuperação de memória:

```
Qual tecnologia eu uso no backend mesmo?
```

_(Deve recuperar: FastAPI, Python, PostgreSQL)_

```
O que eu te contei sobre meu trabalho?
```

_(Deve recuperar: TechCorp, fintech, equipe de 12 pessoas)_

```
Me lembra qual é meu horário preferido de trabalho?
```

_(Deve recuperar: manhã cedo, 6h)_

---

## 📁 Arquivos Gerados

Após a interação, verifique os arquivos em `data/`:

| Arquivo              | Tipo de Memória | Conteúdo                        |
| -------------------- | --------------- | ------------------------------- |
| `long_term_001.json` | Long-term       | Fatos, preferências, interações |
| `vector_001.json`    | Vector          | Embeddings das mensagens        |
| `summary_001.json`   | Summary         | Resumos comprimidos             |

---

## 💡 Dicas

1. **Para forçar um resumo:** O sistema comprime automaticamente após 20 mensagens
2. **Para testar poda:** Use `/prune` para remover memórias antigas (>180 dias)
3. **Para limpar e recomeçar:** Use `/clear` para limpar short-term

---

## 🎯 Resultado Esperado

Ao final, o agente deve:

- ✅ Lembrar seu nome (Carlos) e empresa (TechCorp)
- ✅ Saber sua stack técnica (Python, FastAPI, Next.js, etc.)
- ✅ Conhecer seu horário de trabalho preferido (manhã)
- ✅ Ter resumos das conversas anteriores
- ✅ Fazer buscas semânticas por similaridade

---

_Arquivo gerado para testar o sistema de memória em `memory_agent.py`_
