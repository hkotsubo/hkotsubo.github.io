---
layout: custompost
title: "Essa linguagem é compilada ou interpretada?"
date: 2026-02-12 08:00:00 -0300
categories: linguagens
description: A resposta não é tão simples assim.
show_desc: true
comments: true
---

Antes de tudo, vamos recapitular dois conceitos importantes: especificação e implementação. E todos já devem conhecer a clássica analogia: especificação é a receita do bolo, implementação é o bolo propriamente dito. A especificação só diz o que fazer, e para alguns passos pode até dizer como deve ser feito (mas para outros, pode deixar em aberto). Já a implementação é quando todos os passos são executados de fato.

Pois bem, toda linguagem de programação tem (ou pelo menos deveria ter) uma especificação que define seu funcionamento básico: sua sintaxe (palavras-chave, declaração de variáveis/funções/classes/qualquer outra estrutura, etc) e semântica (o que cada comando ou declaração significa).

Mas somente com a especificação não dá pra programar com a linguagem. Precisamos da implementação, que consiste em um ou mais programas para ler o código fonte, validá-lo e executá-lo de acordo com as regras definidas pela especificação.

Então quando falamos que determinada linguagem é compilada, na verdade estamos falando da implementação que está sendo usada. A linguagem (a especificação) é apenas o texto que descreve o seu funcionamento. A implementação é que pode usar um compilador, que vai ler o código fonte e transformá-lo em um algo que pode ser executado.

Eu entendo a confusão, pois muitas vezes dizer que "_linguagem X é compilada_" é apenas uma simplificação para facilitar o entendimento e a comunicação. O que acontece é que toda linguagem costuma ter uma implementação que é a mais usada (isso quando não é a única), e se essa implementação usa um compilador, acabam dizendo que a linguagem é compilada. Mesmo que existam outras implementações que façam diferente.

Ou seja, ser compilado ou interpretado é uma característica da implementação, não da linguagem. Até porque as especificações não costumam restringir isso, tanto que existe interpretador de C, por exemplo. Se vai ser útil ou amplamente adotado, é outra história. O ponto é que não existe restrição técnica.

---

Essa distinção entre "compilado vs interpretado" é uma [falsa dicotomia](https://pt.wikipedia.org/wiki/Falsa_dicotomia), pois dá a entender que uma determinada implementação só pode ser uma dessas opções. Mas na verdade as coisas são um pouquinho mais complicadas.

Até hoje tem gente acha que compilador é só o que transforma o código fonte em código de máquina. É o caso do GCC (o compilador mais popular de C), que gera um executável que pode ser rodado diretamente no ambiente para o qual foi compilado.

Mas Java faz diferente: seu compilador converte o código fonte em um [_bytecode_](https://en.wikipedia.org/wiki/Bytecode) (um formato binário intermediário - no caso do Java, são os arquivos `.class`). Este *bytecode*, por sua vez, é executado por uma máquina virtual (VM - *virtual machine*). No caso do Java, é a famosa JVM (Java Virtual Machine).

Embora muita gente ache que é tudo uma coisa só, não é. Tanto que existem duas especificações separadas: uma para a linguagem ([Java Language Specification](https://docs.oracle.com/javase/specs/jls/se25/html/index.html)) e outra para a JVM ([Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se25/html/index.html)). Essa separação permite que [outras linguagens possam rodar na JVM](https://en.wikipedia.org/wiki/List_of_JVM_languages), pois basta criar um compilador que, em vez de gerar código de máquina, gere *bytecode* compatível com a JVM. E vários foram criados, inclusive para Python, PHP e JavaScript, só para citar três linguagens *mainstream*.

A separação também permite que [existam várias implementações da JVM](https://en.wikipedia.org/wiki/List_of_Java_virtual_machines).

Ou seja, os compiladores do Java não geram código de máquina como os compiladores de C, existe uma etapa intermediária para gerar o *bytecode*. C# faz o mesmo: gera um _bytecode_ (chamado de CIL - Common Intermediate Language), que é executado por uma VM (CLR - Common Language Runtime). E quase sempre dizem que Java e C# são linguagens compiladas, ou seja, aquela noção de que compilar sempre gera código de máquina já não vale mais.

Mas se "gerar _bytecode_ que é executado por uma VM" também é uma característica de "linguagem compilada", então por que muitos dizem que Python e JavaScript são interpretadas? Afinal, suas implementações mais usadas também fazem a mesma coisa.

No caso de Python, a implementação mais usada é o [CPython](https://github.com/python/cpython), que compila o código fonte e gera um *bytecode*, que é executado por uma VM. No caso de JavaScript, as implementações mais comuns são a [V8](https://v8.dev/) (do Google, e que é usada no Chrome, e também no Node.js e Deno), [SpiderMonkey](https://spidermonkey.dev/) (usada no Firefox) e [JavaScriptCore](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html) (usada no Safari), e todas geram *bytecode* que depois é executado por uma VM.

A diferença é que em Java e C# a compilação costuma ser separada da execução pela VM (por exemplo, em Java tem o comando `javac` para compilar, e `java` para invocar a VM, embora nas versões mais novas existam opções para fazer tudo de uma vez). Já em Python e JavaScript isso geralmente ocorre de uma vez, dando a impressão de que é tudo uma coisa só. Mas para todas o processo é essencialmente o mesmo (compila -> *bytecode* -> VM). Mesmo assim, você ainda vê gente dizendo que Java e C# são compiladas, enquanto Python e JS são interpretadas.

# "_Ah, então elas são o que?_"

Essa distinção entre "compilado vs interpretado" não existe da forma que você está pensando. **Pare de tentar encaixar as linguagens em uma dessas caixinhas**, pois nem são caixinhas de fato, está mais para um grande caldeirão onde tudo se mistura. A interpretação pura de código fonte, do tipo "_lê uma linha, executa, lê outra linha, executa, etc_" praticamente não existe mais (entre as exceções notáveis temos os interpretadores de Shell Script, como o Bash, C shell, Z shell, etc, e algumas implementações de Lisp). O que tem bastante hoje em dia é uma abordagem híbrida. Muitas implementações têm optado por gerar *bytecode* e executá-lo em uma VM.

Aliás, a VM pode ser implementada como um interpretador, que executa os comandos em sequência à medida em que são lidos do *bytecode* (que é um formato binário, ou seja, enquanto a interpretação de código fonte se tornou rara, a de *bytecode* não). Então poderíamos até dizer que as implementações que usam esta abordagem são tanto compiladas quanto interpretadas, só que cada um ocorre em uma etapa diferente.

E não para por aí: essa VM, ao executar o *bytecode*, pode ainda compilá-lo para código de máquina, e geralmente decide fazer isso durante a execução. É o que chamamos de [JIT (Just in Time compiler)](https://pt.stackoverflow.com/q/146250/112052). É isso mesmo, dentro da VM pode ter **outro** compilador. A diferença é que, em vez de transformar código fonte em binário, ele transforma um binário (no caso, o *bytecode*) em outro binário (código de máquina, geralmente otimizado para o ambiente específico no qual está rodando). Java tem isso, C# também tem, JavaScript também (sim, o browser faz tudo isso por debaixo dos panos). PHP passou a ter na versão 8. O CPython (para a versão 3.14 da linguagem) atualmente tem um [JIT experimental](https://docs.python.org/3/whatsnew/3.14.html#binary-releases-for-the-experimental-just-in-time-compiler) e por *default* vem desabilitado, mas existem outras implementações como o [PyPy](https://pypy.org/), que já possui JIT há muito tempo.

Ou seja, em muitas implementações temos um compilador para gerar o *bytecode* e uma VM que usa um interpretador para executar esse *bytecode*. E a VM pode ter outro compilador para transformar o *bytecode* em código de máquina. É comum que a VM escolha apenas alguns trechos do *bytecode* para esta etapa, de acordo com certos critérios (como "rodou muitas vezes" e "está de um jeito que dá pra otimizar"). Isso varia conforme a implementação, claro.

Enfim, é uma abordagem que vem sendo bastante usada por muitas implementações de várias linguagens, e mostra como essa distinção entre "compilado vs interpretado" deixou de fazer sentido. Dizer que determinada linguagem é uma dessas coisas faz menos sentido ainda, já que essas são características da implementação. E mesmo se considerarmos as implementações, muitas estão adotando essa abordagem híbrida, fazendo com que a distinção desapareça.

---

Lembrando que este texto é apenas um resumo (nem falei de [LLVM](https://llvm.org/), por exemplo - não confundir com LLM, que é outra coisa), então recomendo alguns links para complementar:

- [Qual a diferença entre linguagem compilada para linguagem interpretada?](https://pt.stackoverflow.com/q/77070/112052)
- [Is Python interpreted, or compiled, or both?](https://stackoverflow.com/q/6889747)
- [Is Python Interpreted or Compiled?](https://softwareengineering.stackexchange.com/q/24558)
- [What is the formal, rigorous definition of a programming language?](https://cs.stackexchange.com/q/129705)
- [What's the difference between compiled and interpreted language?](https://stackoverflow.com/q/2657268)
- [O que é linguagem de programação, IDE e compilador?](https://pt.stackoverflow.com/q/101691/112052)
- [O que é uma linguagem interpretada? Java é interpretado?](https://pt.stackoverflow.com/q/22647/112052)
- [Como é desenvolvida uma linguagem de programação?](https://pt.stackoverflow.com/q/124436/112052)
- [Como é feito um compilador?](https://pt.stackoverflow.com/q/104814/112052)
