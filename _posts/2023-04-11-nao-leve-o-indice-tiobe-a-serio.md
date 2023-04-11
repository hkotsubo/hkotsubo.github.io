---
layout: custompost
title: "Não leve o Índice TIOBE tão a sério"
date: 2023-04-11 08:00:00 -0300
categories: tiobe
description: O Índice TIOBE, embora muito conhecido por indicar a "popularidade" de linguagens de programação, não deveria ser levado tão a sério. Leia mais e entenda os motivos...
show_desc: true
comments: true
---

Provavelmente você já ouviu falar do [Índice TIOBE](https://www.tiobe.com/tiobe-index/), que mede a "popularidade" das linguagens de programação. Vira e mexe sai alguma notícia dizendo que linguagem X entrou no top 50, ou linguagem Y passou a linguagem Z e agora é a primeira, etc. E aí aparecem os inevitáveis comentários de gente comemorando que sua linguagem favorita subiu (ou que a linguagem que não gosta caiu) N posições. E o pior, usam isso como argumento para defender que uma linguagem é "melhor" ou "pior" que a outra.

Bem, discutir qual linguagem é melhor, e/ou ser torcedor/*fanboy*/*cheerleader* de linguagem, já é algo que eu acho - pra não dizer outra coisa - ridículo. Além de ser uma discussão muitas vezes inútil e improdutiva. E usar o Índice TIOBE como argumento nessa discussão é pior ainda, e nos parágrafos seguintes explicarei os motivos (*disclaimer: este post é baseado [neste comentário que fiz no TabNews](https://www.tabnews.com.br/kht/4606e326-d3c9-4a68-b97e-231a927ee66f)*).

---

# Como o Índice TIOBE é calculado

No [próprio site do índice](https://www.tiobe.com/tiobe-index/programminglanguages_definition/) tem a explicação completa. Aqui eu traduzirei e comentarei apenas alguns trechos que são pertinentes ao ponto que quero discutir.

Em resumo, é feita uma busca pelo termo `+"<language> programming"`, para várias linguagens. Por exemplo: `+"JavaScript programming"`, `+"Python programming"`, etc. O sinal de mais e as aspas são uma "sintaxe comum" em muitos mecanismos de busca, para indicar que deve obrigatoriamente buscar por esses dois termos exatamente nesta ordem. Esta busca é feita em vários sites diferentes, e a quantidade de *hits* (resultados) é usada para calcular o valor daquela linguagem no índice. Basicamente, quanto mais resultados, maior é o valor (e melhor a classificação da linguagem).

A lista de linguagens, os sites onde a busca é feita, e a fórmula para calcular o valor estão bem explicados no [link já citado](https://www.tiobe.com/tiobe-index/programminglanguages_definition/). Lá também tem os critérios para escolher as linguagens e sites. Mas vamos focar em um ponto específico, e que na minha opinião mostra como o índice não deve ser levado tão a sério.

## Escolha dos sites

São escolhidos os 25 melhores sites do ranking da [Similarweb](https://www.similarweb.com/) (empresa que fornece serviços de *Web Analytics*), que satisfaçam os seguintes critérios:

- a página inicial deve ter um campo de busca
- a página de busca contém uma indicação da quantidade de resultados encontrados
- os resultados estão disponíveis no HTML (ou seja, nada daquele JS que coloca o valor dinamicamente em algum lugar)
- idiomas com caracteres especiais são corretamente codificados
- a busca deve retornar pelo menos um resultado
- os resultados não devem ter muitas discrepâncias
- sites pornográficos são desconsiderados

A partir disto temos uma lista de 25 sites, que pelos critérios acima podem variar dependendo da época. Olhando hoje (11 de abril de 2023), a lista contém alguns sites "óbvios" como o Google, Bing e Wikipedia. **Mas tem dois que me chamaram a atenção: o [Walmart.com](https://www.walmart.com/) (??) e o [Etsy.com](https://www.etsy.com/) (que é um site que vende roupas, calçados, artigos para a casa, cozinha, etc).**

### Sério, por que buscas feitas nesses dois sites são consideradas em um ranking de popularidade de **linguagens de programação**?

Só por curiosidade, fiz uma busca por `+"Java programming"` em ambos.

No Etsy, a busca retornou [adesivos, canecas e camisetas](https://www.etsy.com/search?q=%2B%22Java%20programming%22&ref=search_bar):

<img src="/assets/img/etsy_adesivos_canecas.png" title="Adesivos e canecas" alt="Adesivos e canecas" />
<br><br>
<img src="/assets/img/etsy_camisetas_canecas.png" title="Camisetas e canecas" alt="Camisetas e canecas" />

Já no site do Walmart, [retornou livros](https://www.walmart.com/search?q=%2B%22Java+programming%22):

<img src="/assets/img/walmart_livros.png" title="Livros" alt="Livros" />

Só o fato disso ser considerado no índice já deveria servir para desqualificá-lo, na minha opinião.

Então da próxima vez que você pensar em usar o Índice TIOBE para argumentar que uma linguagem é "melhor" ou "pior", pense nisso.
