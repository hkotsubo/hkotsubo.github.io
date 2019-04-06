---
layout: custompost
title: "Posso usar expressões regulares (regex) para validar datas?"
date: 2019-04-05 21:50:00 -0300
categories: data regex
desc: Usar regex para validar datas é uma ideia que muitos têm e que parece simples. Mas datas nunca são simples...
show_desc: true
---

Primeiro, alguns _disclaimers_:

- Estou assumindo que você já está familiarizado com expressões regulares (ao menos o básico), que chamarei de *regex* (abreviação de *Regular Expression*).
- Eu **adoro** regex, é uma ferramenta fantástica. Já usei — e uso — bastante no dia-a-dia, mas também sei que [não é a solução para todos os problemas](https://blog.codinghorror.com/regular-expressions-now-you-have-two-problems/). Assim como qualquer outra tecnologia, é importante saber usá-la, mas é mais importante ainda saber quando não usá-la.

Um ótimo exemplo é tentar usar uma regex para validar uma data. Se eu tenho `Strings` com valores como `10/03/2018` ou `10/90/1022`, como posso verificar se elas são datas válidas no formato "dia/mês/ano"?

"Já sei!", você pensa, "Vou usar regex!" — *eu já pensei assim, geralmente isso acontece logo depois que você acabou de aprender regex e acha que é a coisa mais incrível do mundo*.

Sempre começa simples. Se a data está no formato `dd/mm/aaaa`, a primeira regex é geralmente algo do tipo[^barra]:

```java
\d{2}/\d{2}/\d{4}
```

  [^barra]: Em algumas engines de regex, a barra (`/`) é usada como delimitador e precisa ser escapada (com uma `\` antes), então a regex ficaria `\d{2}\/\d{2}\/\d{4}`

A regex acima busca por "2 dígitos, barra, 2 dígitos, outra barra, 4 dígitos". Mas aí você percebe que ela aceita coisas como `99/99/9999` (dia 99 do mês 99) e `32/01/2018` (32 de janeiro). Mas tudo bem, basta fazer uma "simples" modificação para evitar esses valores inválidos, e aí temos algo parecido com isso:

```java
(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/(19|20)\d{2}
```

Agora o dia pode ter valores entre `01` e `31`, meses podem ser de `01` a `12`, e anos de `1900` a `2099`. Também poderíamos ter deixado o ano como `\d{4}` para aceitar qualquer número de 4 dígitos, vai variar conforme cada caso.

Tudo parece muito bom, até você descobrir que esta regex deixa passar datas inválidas como `31/04/2017` (31 de abril) e `29/02/2017` (29 de fevereiro de 2017).<!--more-->

Qual o problema? Bem, abril só tem 30 dias e 2017 não é ano bissexto, então nesse ano fevereiro tem somente 28 dias. Mas a regex acima considera que ambos são datas válidas.

"Mas tudo bem", você pensa, "vamos procurar no Google".

E é aí que você se assusta ao encontrar expressões monstruosas, como [esta](https://gist.github.com/mlconnor/5415469):

`
var regex = new RegExp("^(?:(?:(?:(?:[13579][26]|[2468][048])00)|(?:[0-9]{2}(?:(?:[13579][26])|(?:[2468][048]|0[48]))))(?:(?:(?:09|04|06|11)(?:0[1-9]|1[0-9]|2[0-9]|30))|(?:(?:01|03|05|07|08|10|12)(?:0[1-9]|1[0-9]|2[0-9]|3[01]))|(?:02(?:0[1-9]|1[0-9]|2[0-9]))))|(?:[0-9]{4}(?:(?:(?:09|04|06|11)(?:0[1-9]|1[0-9]|2[0-9]|30))|(?:(?:01|03|05|07|08|10|12)(?:0[1-9]|1[0-9]|2[0-9]|3[01]))|(?:02(?:[01][0-9]|2[0-8]))))$");
`

Conseguiu entender? Que tal [essa](https://stackoverflow.com/a/15504877)?

`
^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$
`

É aqui que devemos parar e pensar. Olhe novamente para as expressões acima e tente entendê-las. Eu espero...

A primeira regex verifica datas no formato `aaaammdd`, enquanto a segunda verifica o formato `dd/mm/aaaa`, mas também aceita outros delimitadores além da barra, como o hífen e o ponto. Além disso, a segunda regex também aceita o dia e mês sem o zero (ou seja, aceita tanto `01/01/2019` quanto `1/1/2019`). Tente identificar quais trechos correspondem ao ano, mês e dia, só para ter uma ideia do quão difícil seria ter que trabalhar com estas expressões. Tente mudar a primeira expressão para aceitar o formato `dd/mm/aaaa`, e tente mudar a segunda expressão para aceitar somente dias e meses com dois dígitos e apenas a barra como separador.

---
## Encontre o equilíbrio

Este é um ponto importante ao se trabalhar com regex. Você precisa encontrar um equilíbrio entre a facilidade de uso e manutenção, versus o quão correta ela é (se ela só aceita o que eu quero, e não aceita o que eu não quero). No caso, será que vale a pena usar as expressões gigantes para os casos de meses que não têm 31 dias e verificação de anos bissextos?

Por mais que seja legal (eu acho, apesar de complicado), temos que levar em conta a clareza, legibilidade e facilidade de manutenção do código, e para mim essas regex não tem nenhuma dessas características. Eu só usaria essas expressões em produção se não tivesse outra alternativa, como parece ser o caso [desse cara](https://pt.stackoverflow.com/q/371316/112052) (ele não explica o motivo, mas diz que "só pode usar a regex").

Na minha opinião, usar a regex gigante é ter mais trabalho do que o necessário, simplesmente porque não estamos usando a ferramenta ideal para resolver o problema. Para saber se um ano é bissexto, por exemplo, temos que verificar se ele é divisível por 4, mas se também for múltiplo de 100, só será bissexto se for divisível por 400.

Como são operações matemáticas, regex não é a melhor ferramenta para usarmos, já que elas trabalham basicamente com texto, então dígitos como `1` e `2` são tratados como qualquer outro caractere. Por isso a verificação acaba ficando tão grande e confusa. Validações que envolvem cálculos matemáticos são mais fáceis de serem feitos fora da regex.

Qualquer linguagem já possui nativamente operações matemáticas e a regra do ano bissexto pode ser feita em poucas linhas de código. Apenas para mostrar um exemplo, na classe [`java.time.Year`](https://docs.oracle.com/javase/8/docs/api/java/time/Year.html) é feito assim:

```java
// verifica se um ano é bissexto
public static boolean isLeap(long year) {
    return ((year & 3) == 0) && ((year % 100) != 0 || (year % 400) == 0);
}
```

Simples, rápido e direto. Melhor ainda, já está implementado na API da maioria das linguagens (e mesmo se não estiver, não é algo difícil de fazer). Usar regex para isso é muito mais complicado e não vale a pena.

Expressões regulares não são - e não deveriam ser usadas como - *parsers*. Na verdade há várias situações nas quais o seu uso não é recomendado, conforme [esta ótima resposta no Software Engineering Stack Exchange](https://softwareengineering.stackexchange.com/a/113243). Repare que ela já começa com:

> "Não use regex quando existem parsers. Isto **não se limita a HTML**."

Embora a resposta não tenha citado datas, elas caem no mesmo caso acima: se já existem *parsers* específicos, dê preferência a eles.

Regex é uma ótima ferramenta para, entre outras coisas, procurar padrões em um texto, e **em alguns casos mais básicos com entradas mais controladas**, pode até ser usada para *parsing* e validação. Mas quando os dados tem regras complicadas de validação, como é o caso de datas e horas, não é a melhor opção. O ponto é: se há um *parser* específico para os seus dados, use-o.

Embora seja possível usar uma regex enorme e complicada para validar uma data, esta não é a melhor forma de fazê-lo. Toda linguagem tem alguma API (nativa ou não) para trabalhar com datas, então use-as. Em Java, por exemplo, existe a [API `java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html) (disponível a partir do Java 8).  Para Java 6 e 7, você pode usar o [ThreeTen Backport](www.threeten.org/threetenbp/), que possui as mesmas funcionalidades do `java.time`, apenas o nome do pacote é diferente: `org.threeten.bp` (na verdade há mais diferenças, mas a maior parte das funcionalidades está presente no *backport*). No caso, o código seria assim:

```java
DateTimeFormatter parser = DateTimeFormatter.ofPattern("dd/MM/yyyy")
    .withResolverStyle(ResolverStyle.STRICT);
LocalDate data = LocalDate.parse("10/02/2018", parser);
```

O [`DateTimeFormatter`](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html) verifica se a `String` está no formato correto, e também faz as validações de acordo com todas as regras de data e hora citadas acima: valor mínimo e máximo para cada campo, ano bissexto, etc. Se a data é inválida (como `29/02/2017` e `31/04/2017`), é lançada uma exceção, já que o modo [`STRICT`](https://docs.oracle.com/javase/8/docs/api/java/time/format/ResolverStyle.html#STRICT) está sendo usado — no modo padrão ([`SMART`](https://docs.oracle.com/javase/8/docs/api/java/time/format/ResolverStyle.html#SMART)), estas datas seriam ajustadas para o último dia do mês.

Esta solução é muito melhor do que usar regex. Não apenas porque o código ficou mais simples, legível e de fácil manutenção, mas também porque você estará usando a ferramenta correta para o problema a ser resolvido.

Outra vantagem é que a API já retorna um objeto que representa a data (no exemplo acima, um [`LocalDate`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html)), permitindo que usemos métodos como [`getMonth()`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html#getMonth--) e [`getDayOfWeek()`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html#getDayOfWeek--) para obter informações da data, ou realizar operações com [`plusDays()`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html#plusDays-long-) e [`minusYears()`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html#minusYears-long-), entre várias outras disponíveis na API. Já usando regex você só conseguiria validar a `String`, mas para trabalhar com a data você teria que criar o `LocalDate` de qualquer maneira, então por que não usar simplesmente a API? _(mesmo que você não vá usar a data, validar com a API é bem mais fácil do que com regex)_

Praticamente todas as linguagens possuem tipos específicos de data e hora, além de maneiras de converter de/para string. Se não tiver isso nativamente, com certeza existe alguma biblioteca/API/módulo/componente/*mixin*/etc. Se quiser ver exemplos em outras linguagens, segue alguns [em Python](https://pt.stackoverflow.com/a/363711/112052) (no início tem algumas regex, mas mais pro final tem código usando o módulo [`datetime`](https://docs.python.org/3/library/datetime.html)) e [JavaScript](https://pt.stackoverflow.com/a/371327/112052).

E estamos falando apenas de dia, mês e ano. Se quisermos incluir hora, minuto, segundo, frações de segundo e [_offsets_](https://en.wikipedia.org/wiki/UTC_offset), as coisas ficam ainda mais complicadas. Tente imaginar uma regex que valida todas as `Strings` abaixo (todas estão no formato [ISO8601](https://en.wikipedia.org/wiki/ISO_8601)):

```
2018-02-10T10:30:45.143923Z
2018-02-10T10:30:45.561-0100
2018-02-10T10:30:45+05:30
2018-02-10T10:30:45
2018-02-10
```

Lembrando que horas possuem regras próprias (valores máximos e mínimos, por exemplo), e o offset pode ser `Z` (para [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time)), ou ter valores como `+05:30`, `-0100` e `+02`. Embora menos complicadas que as regras de data, ainda sim são coisas que vão tornar sua regex cada vez maior e mais difícil de ser mantida e entendida. Lembrando que só a parte da data já virou aquela regex monstruosa que vimos acima.

Com a API `java.time`, você poderia por exemplo usar um [`DateTimeFormatterBuilder`](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatterBuilder.html) com formatadores opcionais, e usar [`parseBest()`](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html#parseBest-java.lang.CharSequence-java.time.temporal.TemporalQuery...-) ou [`parseDefaulting()`](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatterBuilder.html#parseDefaulting-java.time.temporal.TemporalField-long-), dependendo do que você precisa ([deixei um exemplo no GitHub](https://github.com/hkotsubo/java-datetime-book/blob/master/src/main/java/exemplos/part3/Cap18Parsing.java#L684)). Como a API possui vários tipos diferentes para representar datas e horas, cada `String` acima pode ser mapeada para um desses tipos, e a forma de fazer o parsing vai depender dos seus casos de uso.

Enfim, regex é legal, mas não é a melhor solução para tudo. Se você quer validar datas e horas, use uma API específica.

## Então nunca devo usar regex para trabalhar com datas?

Bem, "nunca" também é exagero. Suponha que eu tenha um texto gigante e queria extrair datas dele:

> Lorem ipsum dolor sit amet, ne pri esse mundi, ut legere deseruisse **99/00/1000** pri. Duo ad veri quaeque rationibus, **20/10/2018** et eos duis reformidans, timeam legimus deserunt **29/02/2017** has.
Audiam phaedrum an pro, ad nam vitae pertinax interesset. Everti diceret offendit eam **30/04/1970**. // mais um monte de texto....

Neste caso, as datas estão no meio do texto, podendo aparecer em qualquer lugar. Não há um padrão específico que as separa. Por exemplo, se as datas fossem separadas por algum caractere ou se tivesse alguma indicação antes ou depois, ou algo do tipo, seria possível fazer um `split`, mas não é o caso. As datas podem aparecer ao longo do texto, em qualquer parte. A única coisa que sei é que, sempre que tem uma data, ela está no formato `dd/mm/aaaa`.

Então o que eu faria neste caso é usar uma regex para obter os **possíveis candidatos** (partes do texto que **parecem uma data**; no caso, as partes em negrito do texto acima). Por isso, não precisa ser uma regex muito complicada, pois eu quero apenas extrair um pedaço do texto que esteja no formato "2 dígitos, barra, 2 dígitos, barra, 4 dígitos". Tendo isso, posso usar a API de data para validar cada um desses pedaços.

O algoritmo ficaria assim (em pseudo-código):

```
while (não chegou no fim do texto) {
    encontre o próximo trecho que bate com a regex \d{2}/\d{2}/\d{4}
    valide este trecho com a API de datas // se for OK, é uma data válida
}
```

Claro que isso pode ser melhorado para evitar casos como `"1212/12/1980112421"`, que claramente não é uma data (pode ser um código de produto, por exemplo) mas a regex extrairia o trecho `"12/12/1980"` e a API consideraria como uma data válida. A minha intenção aqui não é ensinar regex, mas se você ficou curioso, isso pode ser evitado, por exemplo, usando `\b\d{2}/\d{2}/\d{4}\b` ou `(?<=^|\D)\d{2}/\d{2}/\d{4}(?=\D|$)`. O [link do exemplo em Python](https://pt.stackoverflow.com/a/363711/112052) que coloquei anteriormente mostra um código que faz isso, além de ter uma explicação mais detalhada da regex.

De qualquer forma, esse é um caso em que regex é a ferramenta adequada. Ela é usada para extrair partes de um texto que possuem um padrão específico, e depois a validação de cada uma destas partes é delegada para a API mais apropriada, que neste caso, é uma API de datas.

A escolha de qual regex usar vai depender de cada caso. Uma regex mais simples pode trazer vários trechos que não são datas válidas, delegando o trabalho de verificação para a API de datas. Por outro lado, uma regex mais complicada poderia até diminuir esses falsos positivos, mas se tornaria um pesadelo de manutenção.

No fim, cabe a você avaliar o que vale mais a pena: é aceitável trazer algumas datas inválidas? É possível passar os resultados da regex para a API de datas para validação posterior ou há restrição para usar apenas a regex? Você "sabe" que o texto/arquivo só tem datas válidas (pois é um CSV que foi extraído do banco, por exemplo, então "sem chance" de ter datas inválidas), então a regex mais simples já resolve?

Como regra geral, se eu tenho uma `String` e quero verificar se ela é uma data válida, a API de datas é a melhor opção. Se a data pode estar no meio de um texto, a abordagem mista é mais interessante (regex mais simples para buscar o trecho e validação com API de datas). Cada caso é um caso, avalie e escolha a melhor opção para o seu problema.
