---
layout: custompost
title: "Somar 1 dia a uma data é o mesmo que somar 24 horas?"
date: 2020-05-18 13:00:00 -0300
categories: data aritmética
description: Na maioria das vezes sim, mas a resposta certa é "Depende"
show_desc: true
comments: true
---


Em um [artigo anterior]({{ site.baseurl }}{% post_url 2019-04-06-nao-reinvente-a-roda-como-somar-dias-a-uma-data %}){: class="new-window" }, já vimos como somar dias a uma data é mais complicado do que parece. E agora vamos ver como um dia nem sempre tem 24 horas, e por isso somar 1 dia a uma data nem sempre terá o mesmo resultado de somar 24 horas.

E não estou falando do fato de que a [rotação da Terra está cada vez mais lenta](https://en.wikipedia.org/wiki/Earth%27s_rotation), e sim de algo bem mais complicado: fusos horários.

Neste exato momento, a data e hora atual, em cada lugar do mundo, pode ser diferente. Enquanto em São Paulo são duas da tarde de um domingo, no Japão já são duas da manhã de segunda-feira. Mas dependendo da época do ano, pode ser que duas da tarde em São Paulo seja equivalente a uma da manhã no Japão. Tudo por causa do horário de verão.

Neste exemplo vamos considerar o Horário de Brasília, mas o problema ocorrerá em qualquer lugar que adote o horário de verão, ou cujo fuso horário tenha sido mudado por qualquer motivo que seja. Então para entender porque somar 1 dia nem sempre é o mesmo que somar 24 horas, primeiro precisamos entender como funciona o horário de verão.

---
De forma resumida, o horário de verão consiste em atrasar ou adiantar o relógio uma determinada quantidade de tempo (na maioria dos lugares, essa quantidade é uma hora), em determinada data e horário. No caso do Horário de Brasília, por exemplo, em 4 de novembro de 2018, à meia-noite, os relógios foram adiantados em uma hora. Isso quer dizer que na prática, o relógio pulou de 23:59:59.999 do dia 3 direto para 01:00 do dia 4. Todos os minutos entre 00:00 e 00:59 **não existiram** no dia 4, para este fuso horário. Ou seja, o dia 4 começou na verdade às 01:00, e portanto neste fuso horário, este dia teve 23 horas.

> Isso é chamado de _DST Gap_: "DST" é a sigla para *Daylight Saving Time* (o nome em inglês para Horário de Verão, que muitos também chamam de "Summer Time") e *gap* significa "vão", ou seja, há um "vazio" ali porque uma hora foi "pulada".

Para exemplificar, vou usar a API `java.time`, disponível a partir do Java 8 (porque é a que tenho mais familiaridade, e também porque ela possui mecanismos adequados para lidar com fusos horários, o que facilitará as explicações). Para o exemplo do parágrafo anterior, vou usar a classe [`java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html), que representa uma data e hora em um fuso horário específico:

```java
import java.time.ZoneId;
import java.time.ZonedDateTime;


// 3 de novembro de 2018, às 23:59:59.999999999 no Horário de Brasília
ZonedDateTime zdt = ZonedDateTime.of(2018, 11, 3, 23, 59, 59, 999999999, ZoneId.of("America/Sao_Paulo"));
System.out.println(zdt);              // 2018-11-03T23:59:59.999999999-03:00[America/Sao_Paulo]
// somando 1 nanossegundo
System.out.println(zdt.plusNanos(1)); // 2018-11-04T01:00-02:00[America/Sao_Paulo]
```

Repare como, ao somar 1 nanossegundo à data, o resultado pula direto de 23:59:59 do dia 3 para 1 da manhã do dia 4. Isso acontece porque à meia-noite ocorreu a transição do horário de verão e o relógio foi adiantado em uma hora.

Mas apesar desse "pulo", os instantes continuam sendo contínuos. Se você calcular a diferença entre essas datas, ela será de um 1 nanossegundo:

```java
import java.time.Duration;
import java.time.temporal.ChronoUnit;


// 3 de novembro de 2018, às 23:59:59.999999999 no Horário de Brasília
ZonedDateTime zdt = ZonedDateTime.of(2018, 11, 3, 23, 59, 59, 999999999, ZoneId.of("America/Sao_Paulo"));
// somando 1 nanossegundo
ZonedDateTime zdtDepois = zdt.plusNanos(1);
// diferença entre as datas
System.out.println(ChronoUnit.NANOS.between(zdt, zdtDepois)); // 1
System.out.println(Duration.between(zdt, zdtDepois)); // PT0.000000001S
```

E se convertê-las para UTC, veremos que de fato os instantes são contínuos:

```java
System.out.println(zdt.toInstant());       // 2018-11-04T02:59:59.999999999Z
System.out.println(zdtDepois.toInstant()); // 2018-11-04T03:00:00Z
```

Essa "mágica" acontece porque houve uma mudança de *offset* (a diferença com relação a UTC). Se você reparar na saída do primeiro código, verá que o primeiro caso mostra `-03:00` (3 horas antes de UTC) e o segundo mostra `-02:00` (2 horas antes de UTC). É essa mudança de *offset* que torna possível adiantar o relógio do ponto de vista local, sem quebrar a continuidade dos instantes referentes a antes e depois da mudança.

---
### E o que isso tem a ver com somar 1 dia ou 24 horas a uma data?

Tem tudo a ver. Quando somamos 1 dia a uma data/hora, espera-se que o resultado seja o **mesmo horário do dia seguinte**. E na grande maioria dos casos, isso será o mesmo que somar 24 horas. Mas graças ao horário de verão, nem sempre isso é verdade.

Por exemplo, vamos considerar 3 de novembro de 2018, às 21h no Horário de Brasília:

```java
// 3 de novembro de 2018, às 21:00 no Horário de Brasília
ZonedDateTime zdt = ZonedDateTime.of(2018, 11, 3, 21, 0, 0, 0, ZoneId.of("America/Sao_Paulo"));
System.out.println(zdt);               // 2018-11-03T21:00-03:00[America/Sao_Paulo]
// somar 1 dia
System.out.println(zdt.plusDays(1));   // 2018-11-04T21:00-02:00[America/Sao_Paulo]
// somar 24 horas
System.out.println(zdt.plusHours(24)); // 2018-11-04T22:00-02:00[America/Sao_Paulo]
```

Repare que ao somar 1 dia, o resultado é o mesmo horário do dia seguinte (dia 4 às 21h). Mas ao somar 24 horas, o resultado é **22h** do dia 4.

Isso acontece por causa do horário de verão. Imagine que às 21h do dia 3 eu inicio a contagem em um cronômetro. Quando der meia-noite, o cronômetro estará marcando 3 horas, mas por causa do horário de verão, na verdade não será meia-noite e sim 1 da manhã. Só que o cronômetro não dá esse salto na sua contagem (ele não vai pular de 2 horas e 59 minutos para 4 horas, ele vai continuar marcando que se passaram 3 horas). E ele só vai indicar que se passaram 24 horas às 22h do dia 4.

Já quando eu somo 1 dia, a classe `ZonedDateTime` considera que eu quero o mesmo horário do dia seguinte, então somente os campos relativos à data são alterados, e depois ela faz os devidos ajustes no *offset* (ela verifica que agora a data está em horário de verão e muda o *offset* para `-02:00`).

---
Quando acaba o horário de verão, acontece algo tão ou mais estranho. Ainda usando como exemplo o Horário de Brasília, quando acaba o horário de verão, o relógio é atrasado em uma hora. Em 2019, por exemplo, o horário de verão acabou no dia 17 de fevereiro: à meia-noite, os relógios foram atrasados em uma hora e voltaram para 23:00 do dia 16.

Ou seja, os relógios pularam de 23:59:59.999 do dia 16 para 23:00 do dia 16. Isso quer dizer que todos os minutos entre 23:00 e 23:59 ocorreram **duas vezes**: uma horário de verão e outra no horário "normal".

> Isso é chamado de *DST Overlap*: já vimos acima que "DST" é a sigla em inglês para o horário de verão, e *overlap* é "sobreposição", para indicar que um mesmo intervalo de tempo ocorreu duas vezes.

Usando `ZonedDateTime` para exemplificar:

```java
// 16 de fevereiro de 2019, às 23:59:59.999999999 no Horário de Brasília
ZonedDateTime zdt = ZonedDateTime.of(2019, 2, 16, 23, 59, 59, 999999999, ZoneId.of("America/Sao_Paulo"));
System.out.println(zdt);        // 2019-02-16T23:59:59.999999999-02:00[America/Sao_Paulo]
// somar 1 nanossegundo
ZonedDateTime zdtDepois = zdt.plusNanos(1);
System.out.println(zdtDepois); // 2019-02-16T23:00-03:00[America/Sao_Paulo]

// diferença entre as datas é de 1 nanossegundo
System.out.println(ChronoUnit.NANOS.between(zdt, zdtDepois)); // 1
System.out.println(Duration.between(zdt, zdtDepois)); // PT0.000000001S

// converter para UTC, para mostrar que os instantes são contínuos
System.out.println(zdt.toInstant());       // 2019-02-17T01:59:59.999999999Z
System.out.println(zdtDepois.toInstant()); // 2019-02-17T02:00:00Z
```

Repare que o *offset* mudou de `-02:00` de volta para `-03:00`. Importante reparar também que, como o intervalo entre 23:00 e 23:59 ocorreu duas vezes, o dia 16 teve 25 horas de duração.

E como agora temos uma hora a mais, somar 1 dia não terá o mesmo resultado de somar 24 horas:

```java
// 16 de fevereiro de 2019, às 21:00 no Horário de Brasília
ZonedDateTime zdt = ZonedDateTime.of(2019, 2, 16, 21, 0, 0, 0, ZoneId.of("America/Sao_Paulo"));
System.out.println(zdt);               // 2019-02-16T21:00-02:00[America/Sao_Paulo]
// somar 1 dia
System.out.println(zdt.plusDays(1));   // 2019-02-17T21:00-03:00[America/Sao_Paulo]
// somar 24 horas
System.out.println(zdt.plusHours(24)); // 2019-02-17T20:00-03:00[America/Sao_Paulo]
```

Aqui vale a mesma analogia do cronômetro: se eu ligá-lo às 21h do dia 16, quando chegar meia-noite ele estará marcando 3 horas. Mas o relógio será atrasado em uma hora, e todos os minutos entre 23:00 e 23:59 serão contados novamente (quando chegar meia-noite de novo, o cronômetro estará marcando 4 horas). E quando chegar as 20h do dia 17, ele já estará marcando 24 horas.

---
Vale lembrar que *gaps* e *overlaps* nem sempre são de uma hora (há regiões da Austrália que durante o horário de verão [adiantam o relógio em meia hora](https://www.timeanddate.com/time/zone/australia/lord-howe-island?year=2019)), e nem sempre é por causa do horário de verão (em 2018 a Coreia do Norte [adiantou seu fuso em meia-hora](https://www.timeanddate.com/news/time/north-korea-aligns-with-south.html) para alinhá-lo com o horário da Coreia do Sul).

Lembre-se que quem define as regras de qualquer fuso horário (se vai ou não ter horário de verão, quando começa e termina, qual *offset* será usado, etc) é o governo local de cada região, muitas vezes sem justificativa técnica (é comum dizer que "o povo terá mais horas de sol" e coisas do tipo), então mesmo se hoje não tiver horário de verão na sua região, nada garante que amanhã não haverá. Ao somar datas ou calcular a diferença entre elas, esses fatores sempre devem ser levados em consideração, pois pode dar diferença dependendo da forma como você calcula.

Neste *post* eu foquei mais em Java, apenas para ilustrar a diferença. Outras linguagens podem ter comportamento diferente ou não tratar corretamente todos os casos (JavaScript, por exemplo, dá o mesmo resultado se somar 1 dia ou 24 horas, ignorando os efeitos do horário de verão).