---
layout: custompost
title: "Não reivente a roda: como somar dias a uma data"
date: 2019-04-06 18:20:00 -0300
categories: data aritmética
desc: Somar números é algo que a gente aprende desde cedo na escola e é uma das operações matemáticas mais fáceis que existem. E quando precisamos fazer um programa que soma dias a uma data, achamos que será igualmente fácil. Mas a aritmética de datas esconde várias armadilhas...
show_desc: true
---

Todo mundo que programa já deve ter se deparado com um problema parecido: preciso somar (ou subtrair) X dias a uma data. Para os exemplos abaixo, vamos supor que `X` é 1.

"Simples", você pensa, "É só somar 1 no dia".

Aí você testa para `10/04/2019` e o resultado (somar 1 ao dia 10) é `11/04/2019`. Uau, funcionou! Até que chega o dia `30/04/2019` e o resultado é `31/04/2019`. Ops, abril só tem 30 dias.

"Tudo bem", você pensa, "vou encher de `if`'s". Aí você coloca aquele monte de `if` para saber se o mês tem 31 dias. Algo do tipo (em pseudo-código):

```
dia += 1;
if (mês não tem 31 dias) { // se mês não for janeiro, março, maio, etc...
    dia = 1;
    mes += 1;
}
```

Lindo, né? Até que você testa com `31/12/2019` e descobre que também precisa mudar o ano, pois se somar 1 dia, o resultado deve ser `01/01/2020`.

Depois você testa com `28/02/2019` e `28/02/2020` e descobre que tem que verificar se o ano é bissexto, pois somar 1 dia a estas datas **deve** resultar em, respectivamente, `01/03/2019` e `29/02/2020`.

Enfim, o que parecia simples ("é só somar 1 no dia"), se torna mais complicado do que tínhamos inicialmente imaginado. [Aritmética de datas é difícil, e muitas vezes nada óbvia e bastante contraintuitiva](https://codeblog.jonskeet.uk/2010/12/01/the-joys-of-date-time-arithmetic/). E implementar essas regras manualmente é querer **muito** reinventar a roda.

---
## Use uma API de datas

Muitas linguagens - se não todas - possuem uma ou mais APIs de data que já cuidam de todos esses detalhes para você. Se a linguagem não possui mecanismos nativos - ou se estes não são muito bons - geralmente já existe uma biblioteca externa que faz isso. Pesquise e veja se a sua linguagem favorita possui tal recurso. Abaixo tem exemplos em algumas das linguagens que conheço (com uma ênfase maior em Java, pois é a API que tenho mais familiaridade):

### Java

Se você estiver usando o Java >= 8, use a [API `java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html). Para representar uma data (**somente** o dia, mês e ano), você pode usar a classe [`java.time.LocalDate`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html):

```java
// 3 de abril de 2019
LocalDate data = LocalDate.of(2019, 4, 3); // ou LocalDate.now() para a data atual
// somar 1 dia = 4 de abril de 2019
data = data.plusDays(1);
```

O pacote `java.time` [possui várias outras classes diferentes](https://docs.oracle.com/javase/tutorial/datetime/iso/overview.html) que podem ser usadas dependendo da situação. Temos, por exemplo, [`java.time.LocalDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDateTime.html) para representar uma data e hora, [`java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html) para representar uma data e hora em um *timezone* (fuso horário) específico, etc. E estas classes também possuem o método `plusDays` para somar dias.

Um detalhe é que as classes do `java.time` são imutáveis, então métodos como `plusDays` sempre retornam **outra** instância com os valores modificados. Por isso você deve atribuir o retorno do método em alguma variável.

Se você estiver usando Java 6 e 7, pode usar o [Threeten Backport](https://www.threeten.org/threetenbp/), um *backport* do `java.time`. Ele basicamente possui as mesmas classes e métodos do `java.time`, a diferença é que o nome do pacote é `org.threeten.bp`. Ou seja, com exceção dos `import`'s, o código ficará igual ao do exemplo acima.

Obviamente, você também pode usar a API legada ([`java.util.Date`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html) e [`java.util.Calendar`](https://docs.oracle.com/javase/8/docs/api/java/util/Calendar.html)):

```java
// 3 de abril de 2019
Calendar cal = Calendar.getInstance();
cal.set(2019, Calendar.APRIL, 3);
// somar 1 dia
cal.add(Calendar.DAY_OF_MONTH, 1);
// obter o java.util.Date -> 4 de abril de 2019
Date date = cal.getTime();
```

Eu usei a constante `Calendar.APRIL` para o mês, o que deixa o código um pouco menos confuso, já que nesta API os meses são indexados em zero: janeiro é zero, fevereiro é 1, etc. Isso quer dizer que [o valor de `Calendar.APRIL` é 3](https://docs.oracle.com/javase/8/docs/api/constant-values.html#java.util.Calendar.APRIL). Sempre que vou usar os valores numéricos dos meses com `Calendar`, é comum esquecer de subtrair 1 do mês, então não é raro eu fazer isso:

```
// tentativa - ERRADA - de setar a data para 3 de abril de 2019 (o mês deve ser 3 e não 4)
cal.set(2019, 4, 3);
```

Como os meses são indexados em zero, então abril é o mês 3, e não 4. O código acima seta a data para 3 de **maio** de 2019. Por isso, sempre que posso - e lembro - eu uso as constantes, como `Calendar.APRIL`, que pelo menos diminui os erros (*e a raiva que eles causariam*). Compare com o código anterior, e veja que `LocalDate` não tem esse problema: os meses têm os valores certos e é um detalhe a menos para se preocupar.

### .NET

Em .NET você pode usar um [`DateTime`](https://docs.microsoft.com/pt-br/dotnet/api/system.datetime?view=netframework-4.7.2), que possui o método [`AddDays`](https://docs.microsoft.com/pt-br/dotnet/api/system.datetime.adddays?view=netframework-4.7.2).

```c#
DateTime date = new DateTime(2019, 4, 3); // ou DateTime.Now para a data atual
date = date.AddDays(1);
```

De forma similar ao `java.time`, o método `AddDays` retorna outro `DateTime` com os valores modificados.

### Python

Em Python você pode usar o [módulo `datetime`](https://docs.python.org/3/library/datetime.html). Se quiser trabalhar com somente a data (apenas o dia, mês e ano), pode usar um [`date`](https://docs.python.org/3/library/datetime.html#date-objects), e para somar 1 dia, basta usar um [`timedelta`](https://docs.python.org/3/library/datetime.html#timedelta-objects):

```python
from datetime import date
# 3 de abril de 2019
d = date(2019, 4, 3)
# somar 1 dia = 4 de abril de 2019
d = d + timedelta(days = 1)
```

Se quiser, também pode usar um [`datetime`](https://docs.python.org/3/library/datetime.html#datetime-objects), a diferença é que este também possui o horário. E se você criá-lo com `d = datetime(2019, 4, 3)`, o horário é automaticamente setado para meia-noite.

Também é possível usar [`datetime.now()`](https://docs.python.org/3/library/datetime.html#datetime.datetime.now) para obter a data e hora atual, ou ainda `datetime.now().date()` (ou simplesmente [`date.today()`](https://docs.python.org/3/library/datetime.html#datetime.date.today)) para obter somente a data atual (sem o horário).

### PHP

Em PHP você pode usar a classe [`DateTime`](https://www.php.net/manual/pt_BR/class.datetime.php) para criar a data, e em seguida usar o método [`add`](https://www.php.net/manual/pt_BR/datetime.add.php), passando como parâmetro um [`DateInterval`](https://www.php.net/manual/pt_BR/dateinterval.construct.php):

```php
// data e hora atual
$d = new DateTime();
// muda para 3 de abril de 2019
$d->setDate(2019, 4, 3);
// somar 1 dia = 4 de abril de 2019
$d->add(new DateInterval("P1D"));
```

O detalhe é que `DateInterval` recebe uma string que representa uma [duração no formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations). No caso, `P1D` corresponde a uma duração de 1 dia.

Diferente do que ocorre em Java e .NET, a classe `DateTime` não é imutável, portanto o método `add` muda os valores da própria instância, não sendo necessário atribuir o seu valor em outra variável.

O método `add` só foi introduzido no PHP 5.3.0. Para a versão 5.2.0, uma alternativa é usar o método [`modify`](https://www.php.net/manual/en/datetime.modify.php): `$d->modify('+1 day');`. E para versões anteriores, existe a função [`strtotime`](https://www.php.net/manual/en/function.strtotime.php):

```php
date('d/m/Y', strtotime('2019-04-03 + 1 days'));
```

Lembrando que `strtotime` retorna um timestamp, que em seguida é passado para [`date`](https://www.php.net/manual/en/function.date.php), que por sua vez retorna uma **string** (e não uma data). No caso, a string contém a data no formato "dia/mês/ano".

### JavaScript

Em JavaScript você pode usar [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). O suporte nativo para aritmética de datas não é lá essas coisas, mas para este caso específico serve:

```javascript
// 3 de abril de 2019
let d = new Date(2019, 3, 3); // ou new Date() para a data atual
// somar 1 dia = 4 de abril de 2019
d.setDate(d.getDate() + 1);
```

Repare que em JavaScript existe o mesmo problema - que muitos consideram uma terrível falha de *design* - que `java.util.Calendar`: os meses são indexados em zero. Isso quer dizer que para criar uma data em abril eu devo usar o mês 3.

Em seguida, para somar 1 dia, basta usar [`setDate`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate), passando o valor atual de [`getDate()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate) mais 1. Isso funciona inclusive para o último dia do mês, pois `Date` ajusta automaticamente esses valores. Por exemplo, se a data for 30 de abril, o dia seguinte será 31. Mas abril só tem 30 dias, então internamente é feito um ajuste automático para 1 de maio.

Outra alternativa é usar o [Moment.js](https://momentjs.com). Muitos podem achar um exagero ("_putz, adicionar mais uma dependência?_"), mas hoje em dia tem gente [adicionando dependências para coisas muito mais simples e triviais](https://www.davidhaney.io/npm-left-pad-have-we-forgotten-how-to-program/), então por que não adicionar uma que faz coisas bem mais complexas, como aritmética de datas?

```javascript
// 3 de abril de 2019
let d = moment([2019, 3, 3]); // ou moment() para a data atual
// somar 1 dia = 4 a de abril de 2019
d.add(1, 'day');
```

Você ainda pode converter o `moment` para um `Date`, fazendo [`d.toDate()`](https://momentjs.com/docs/#/displaying/as-javascript-date/).

---

A grande vantagem de usar uma API específica - em vez de fazer as contas manualmente - é que ela já cuida de todos os detalhes para você: se o mês tem 28, 29, 30 ou 31 dias, se tem que mudar o ano, etc, você não precisa se preocupar com isso. É claro que, se for como um exercício com fins puramente educacionais, é um desafio interessante. Mas se for para código que vai para a produção, não invente. Use uma API de datas para somar os dias e pronto.

_**PS**: Este post aborda o básico, pois ainda nem entramos nos detalhes sobre horário de verão (quando um dia não tem 24 horas e somar 1 dia nem sempre dá o resultado esperado). Também não falamos sobre somar meses e anos, que apesar de parecer a mesma coisa, não é. Aguarde que em breve teremos posts específicos para cada um desses assuntos!_
