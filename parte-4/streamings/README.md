# 🧠 Streaming Agent - Pensamento em Tempo Real

Este agente demonstra como implementar **streaming em tempo real** com a API da OpenAI, mostrando o **processo de pensamento** do modelo (Chain of Thought) conforme ele é gerado.

## 📋 Conceito

O streaming permite que você veja a resposta do modelo **enquanto ela está sendo gerada**, token por token. Combinado com Chain of Thought, você consegue visualizar:

- **💭 Pensamento**: Os passos de raciocínio do agente
- **📢 Resposta**: A resposta final detalhada
- **📊 Estatísticas**: Uso de tokens

## 🏗️ Como Funciona

```python
# Habilita streaming na chamada
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[...],
    stream=True  # Recebe token por token
)

# Itera sobre cada chunk conforme chega
for chunk in stream:
    token = chunk.choices[0].delta.content
    print(token, end="", flush=True)  # Imprime em tempo real
```

### Chain of Thought

O agente usa um prompt estruturado que instrui o modelo a mostrar seu raciocínio:

```python
instrucao = """
IMPORTANTE: Sempre estruture sua resposta assim:

<pensando>
- Passo 1: Analisar a pergunta...
- Passo 2: Considerar aspectos relevantes...
- Passo 3: Formular a resposta...
</pensando>

<resposta>
[Resposta final detalhada]
</resposta>
"""
```

## 🚀 Como Usar

### 1. Instalar dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar variável de ambiente

Certifique-se de ter um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua_chave_aqui
```

### 3. Executar o agente

```bash
python streaming_agent.py
```

## 🎮 Exemplo de Uso

```
============================================================
🧠 AGENTE COM PENSAMENTO EM TEMPO REAL
============================================================
Faça uma pergunta e veja o agente pensar!
Digite 'sair' para encerrar.
============================================================

💬 Você: O que é Python?

============================================================
🧠 AGENTE PENSANDO EM TEMPO REAL
============================================================
📝 Pergunta: O que é Python?
------------------------------------------------------------

💭 PENSANDO...
- Passo 1: Analisar a pergunta - usuário quer saber sobre Python
- Passo 2: Considerar aspectos - história, características, usos
- Passo 3: Formular resposta detalhada com exemplos

✅ Pensamento concluído!

📢 RESPOSTA:
Python é uma linguagem de programação de alto nível...

------------------------------------------------------------
📊 ESTATÍSTICAS:
   • Tokens de entrada: 85
   • Tokens de saída: 320
   • Total: 405
============================================================
```

## 🔧 Estrutura do Código

| Classe/Método    | Descrição                                        |
| ---------------- | ------------------------------------------------ |
| `StreamingAgent` | Agente principal com Chain of Thought            |
| `responder()`    | Gera resposta mostrando pensamento em tempo real |
| `main()`         | Loop interativo do agente                        |
