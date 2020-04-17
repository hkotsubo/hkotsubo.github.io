---
layout: custompost
title: "O programador foi ao mercado"
date: 2020-04-17 15:00:00 -0300
categories: piada_ruim
description: Você provavelmente já ouviu alguma variação dessa piada. O que você não ouviu, é que dá para tirar uma lição dela.
show_desc: true
comments: true
---

Você provavelmente já ouviu alguma variação dessa piada. A esposa do programador diz para ele ir ao mercado e dá instruções bem claras:

> -Se tiver batata, traga duas. Se tiver cebola, traga três.

E então ele volta com 3 batatas.

---
Apesar de besta, dá para tirar uma "lição de moral" da piada.

O problema aconteceu porque o programador entendeu isso (exemplo em Python):

```python
tem_batata = tem_cebola = True
if tem_batata:
    qtd_batatas = 2
if tem_cebola:
    qtd_batatas = 3
print(f'Querida, cheguei! Trouxe as {qtd_batatas} batatas.')
```

Como no mercado tinha batata e cebola, o resultado é:

```none
Querida, cheguei! Trouxe as 3 batatas.
```

Mas na verdade o que a esposa quis dizer é:

```python
if tem_batata:
    qtd_batatas = 2
if tem_cebola:
    qtd_cebolas = 3 # "Foi isso que eu quis dizer!"
```

Dadas as devidas proporções, é mais ou menos isso que acontece praticamente todos os dias na área de desenvolvimento. Alguém dá uma "especificação", que na verdade é só uma ou duas frases, porque a pessoa acha aquilo tão óbvio que não precisa detalhar. Não precisa de contexto, não há a menor chance de alguém interpretar errado, não tem ambiguidade nenhuma na frase. Não é mesmo?

Aí a equipe de desenvolvimento entende outra coisa e sai fazendo, mesmo achando a regra estranha ("_O que a cebola tem a ver com a quantidade de batatas?_").

Tudo bem que esse caso é anedótico e até meio exagerado, e esmagadora maioria vai achar "óbvio" que a esposa quis dizer "3 cebolas", mas pense em quantas vezes já aconteceu alguma falha de comunicação parecida em projetos nos quais você já trabalhou. Aquela mensagem com duas frases sem pontuação, uma resposta "sim" para um email com várias perguntas, um comentário desconexo, a lista é longa.

E muitas vezes isso poderia ser evitado com uma simples confirmação ("_É isso mesmo? São 3 batatas ou 3 cebolas?_"). Por mais "óbvio" ou "besta" que possa parecer, nunca é demais confirmar algo que pode dar margem para ambiguidade.

---
**PS**: claro que isso também se resolve com uma especificação detalhada e clara, sem ambiguidades. Mas em caso de dúvida, não custa nada perguntar, por mais óbvio que pareça...