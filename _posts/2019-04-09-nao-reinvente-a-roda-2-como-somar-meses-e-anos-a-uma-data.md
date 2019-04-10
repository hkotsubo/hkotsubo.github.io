---
layout: custompost
title: "Não reivente a roda II: como somar meses e anos a uma data"
date: 2019-04-09 20:35:00 -0300
categories: data aritmética
desc: Fácil, é só somar 30 (ou 365) dias, não é? Não, não é tão simples assim...
show_desc: true
---

Na [parte 1]({{ site.baseurl }}{% post_url 2019-04-06-nao-reinvente-a-roda-como-somar-dias-a-uma-data %}){: class="new-window" } já vimos como somar dias a uma data, e como isso não se resume a "somar 1 no dia". Com meses e anos é a mesma coisa, não é só "somar 1 no mês (ou no ano)" e pronto.

Por exemplo, se eu tenho a data `01/01/2019` e somo 1 no valor do mês, o resultado é `01/02/2019`. Então o algoritmo "somar 1 no mês" está funcionando, não é? Até que você testa com `01/12/2019` e descobre que se somar 1 no mês o resultado é `01/13/2019`, mas como não existe mês 13, você deve ajustar o resultado para `01/01/2020`. Tudo bem, é só "fazer um `if`", e essa é a parte fácil.

Agora suponha que eu tenha a data `31/01/2019`. Somando um mês, o resultado é `31/02/2019`. Mas fevereiro não tem 31 dias, então qual deve ser o resultado?

A resposta certa é que "ninguém sabe ao certo". Não há uma regra oficial para isso, como existe na matemática, na qual a operação de soma é formalmente bem definida. O que existe é uma escolha feita por cada API que implementa a operação de "somar meses a uma data". E muitas vezes elas têm opiniões diferentes sobre qual é a melhor abordagem.

Um ponto que muitas implementações levam em conta é a semântica: **se estou somando 1 mês a uma data, então faz todo sentido que o resultado esteja no mês seguinte**. Se a data inicial está em janeiro, somar 1 mês sempre deve resultar em alguma data em fevereiro. Nem todas as APIs implementam desta maneira, claro, mas na minha opinião esta abordagem parece fazer mais sentido.

Voltando ao nosso exemplo: somei 1 mês a `31/01/2019`, o resultado foi `31/02/2019`. Mas fevereiro de 2019 só tem 28 dias, então como eu ajusto o dia 31, de forma que o resultado continue em fevereiro? O que muitas implementações fazem é ajustar para o último dia do mês, resultando em `28/02/2019`.

## Aritmética de datas é bizarra e contraintuitiva

Esse ajuste - necessário para manter a semântica da operação "somar meses" - acaba gerando uma situação bem estranha. Vamos somar 1 mês a várias datas diferentes, usando o mesmo algoritmo acima:

| Data inicial |  + 1 mês (sem ajuste) | + 1 mês (após ajuste)
|:------------:|:---------------------:|:--------------------:
| 28/01/2019   |  28/02/2019           | 28/02/2019
| 29/01/2019   |  29/02/2019           | 28/02/2019
| 30/01/2019   |  30/02/2019           | 28/02/2019
| 31/01/2019   |  31/02/2019           | 28/02/2019

Repare que se somarmos 1 mês a 28, 29, 30 ou 31 de janeiro de 2019, o resultado é a mesma data: 28 de fevereiro de 2019. Isso acontece por causa do ajuste feito para manter a semântica da operação: ao somar 1 mês a uma data em janeiro, o resultado deve estar em fevereiro.

Agora imagine que queremos subtrair 1 mês de `28/02/2019`. O resultado é `28/01/2019` (foi subtraído 1 do valor do mês, e como o dia 28 é válido em janeiro, nenhum ajuste foi feito).

Isso quer dizer que se eu começar com qualquer uma das datas (28, 29, 30 ou 31 de janeiro), somar 1 mês e depois subtrair 1 mês, o resultado não necessariamente será a data original:

| Data inicial | somar 1 mês | e depois subtrair 1 mês
|:------------:|:-----------:|:----------------------:
| 28/01/2019   | 28/02/2019  | 28/01/2019
| 29/01/2019   | 28/02/2019  | 28/01/2019
| 30/01/2019   | 28/02/2019  | 28/01/2019
| 31/01/2019   | 28/02/2019  | 28/01/2019

Pois é, aritmética de datas é tão bizarra e contraintuitiva que nem sempre a soma e subtração são operações inversas.

## Somar anos têm os mesmos problemas

Somar 1 ano a uma data é parecido. Na maioria dos casos não haverá problema, pois somar 1 ao valor do ano geralmente funcionará. O único problema é quando temos 29 de fevereiro. Se somarmos 1 ano à data de `29/02/2016`, o resultado *seria* `29/02/2017`. Mas 2017 não é um ano bissexto, então fevereiro só tem 28 dias nesse ano. E para manter a semântica (somar 1 ano a uma data em fevereiro deveria resultar em fevereiro do ano seguinte), é feito o ajuste para `28/02/2017`, que é o resultado que muitas implementações acabam escolhendo.

Pessoalmente, eu prefiro o "ajuste semântico", pois me parece mais "óbvio" e "natural" (entre aspas porque nada é trivial na aritmética de datas): somar 1 mês a uma data deveria resultar em uma data no mês seguinte, e somar 1 ano deveria resultar no mesmo mês do ano seguinte, mesmo que o preço a se pagar sejam as situações estranhas citadas anteriormente.

Apesar de muitas linguagens seguirem por este caminho, nem todas fazem essas operações desta maneira. Vamos ver alguns exemplos:

### Java

Se você estiver usando o Java >= 8, use a [API `java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html). Para representar uma data (**somente** o dia, mês e ano), você pode usar a classe [`java.time.LocalDate`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html):

```java
// 31 de janeiro de 2016
LocalDate data = LocalDate.of(2016, 1, 31);
// somar 1 mês = 29 de fevereiro de 2016
data = data.plusMonths(1);
// somar 1 ano = 28 de fevereiro de 2017
data = data.plusYears(1);
```

O pacote `java.time` [possui várias outras classes diferentes](https://docs.oracle.com/javase/tutorial/datetime/iso/overview.html) que podem ser usadas dependendo da situação. Temos, por exemplo, [`java.time.LocalDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDateTime.html) para representar uma data e hora, [`java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html) para representar uma data e hora em um *timezone* (fuso horário) específico, etc. E estas classes também possuem os métodos `plusMonths` para somar meses e `plusYears` para somar anos. Ambos fazem os ajustes descritos acima (ajusta para o último dia do mês para manter a semântica).

Um detalhe é que as classes do `java.time` são imutáveis, então métodos como `plusMonths` e `plusYears` sempre retornam **outra** instância com os valores modificados. Por isso você deve atribuir o retorno do método em alguma variável.

Se você estiver usando Java 6 e 7, pode usar o [Threeten Backport](https://www.threeten.org/threetenbp/), um *backport* do `java.time`. Ele basicamente possui as mesmas classes e métodos do `java.time`, a diferença é que o nome do pacote é `org.threeten.bp`. Ou seja, com exceção dos `import`'s, o código ficará igual ao do exemplo acima.

Obviamente, você também pode usar a API legada ([`java.util.Date`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html) e [`java.util.Calendar`](https://docs.oracle.com/javase/8/docs/api/java/util/Calendar.html)):

```java
// 31 de janeiro de 2016
Calendar cal = Calendar.getInstance();
cal.set(2016, Calendar.JANUARY, 31);
// somar 1 mês = 29 de fevereiro 2016
cal.add(Calendar.MONTH, 1);
// somar 1 ano = 28 de fevereiro 2017
cal.add(Calendar.YEAR, 1);
// obter o java.util.Date 
Date date = cal.getTime();
```

Vale lembrar que `Calendar` usa os meses indexados em zero (janeiro é zero, fevereiro é 1, etc). Usar as constantes (como `Calendar.JANUARY`) ajuda a diminuir esta confusão (mas lembre-se que o [valor dessa constante continua sendo zero)](https://docs.oracle.com/javase/8/docs/api/constant-values.html#java.util.Calendar.JANUARY).

### .NET

Em .NET você pode usar um [`DateTime`](https://docs.microsoft.com/pt-br/dotnet/api/system.datetime?view=netframework-4.7.2), que possui os métodos [`AddMonths`](https://docs.microsoft.com/pt-br/dotnet/api/system.datetime.addmonths?view=netframework-4.7.2) e [`AddYears`](https://docs.microsoft.com/pt-br/dotnet/api/system.datetime.addyears?view=netframework-4.7.2).

```c#
// 31 de janeiro de 2016
DateTime date = new DateTime(2016, 1, 31);
// somar 1 mês = 29 de fevereiro de 2016
date = date.AddMonths(1);
// somar 1 ano = 28 de fevereiro de 2017
date = date.AddYears(1);
```

Ambos também fazem os ajustes já citados para manter a semântica das operações, e os métodos `AddMonths` e `AddYears` retornam outra instância de `DateTime` com os valores modificados.

### Python

Em Python você pode usar o [módulo `datetime`](https://docs.python.org/3/library/datetime.html). Se quiser trabalhar com somente a data (apenas o dia, mês e ano), pode usar um [`date`](https://docs.python.org/3/library/datetime.html#date-objects). Infelizmente, não é possível usar [`timedelta`](https://docs.python.org/3/library/datetime.html#timedelta-objects), como [foi feito para somar dias]({{ site.baseurl }}{% post_url 2019-04-06-nao-reinvente-a-roda-como-somar-dias-a-uma-data %}#python){: class="new-window" }, já que `timedelta` só possui dias, mas não meses ou anos.

Nesse caso, uma alternativa é usar o [módulo `dateutil`, disponível no PyPI](https://pypi.org/project/python-dateutil/), que possui a classe [`relativedelta`](https://dateutil.readthedocs.io/en/stable/relativedelta.html):

```python
from datetime import date
from dateutil.relativedelta import relativedelta

# 31 de janeiro de 2016
d = date(2016, 1, 31)
# somar 1 mês = 29 de fevereiro de 2016
d = d + relativedelta(months=1)
# somar 1 ano = 28 de fevereiro de 2017
d = d + relativedelta(years=1)
```

Como podemos ver, também são feitos os devidos ajustes semânticos nos resultados.

Se quiser, também pode usar um [`datetime`](https://docs.python.org/3/library/datetime.html#datetime-objects), a diferença é que este também possui o horário. E se você criá-lo com `d = datetime(2016, 1, 31)`, o horário é automaticamente setado para meia-noite.

# PHP

Em PHP você pode usar a classe [`DateTime`](https://www.php.net/manual/pt_BR/class.datetime.php) para criar a data, e em seguida usar o método [`add`](https://www.php.net/manual/pt_BR/datetime.add.php), passando como parâmetro um [`DateInterval`](https://www.php.net/manual/pt_BR/dateinterval.construct.php). Só que, diferente de Java, .NET e Python, no PHP não é feito o ajuste semântico. Então somar 1 mês a uma data em janeiro pode resultar em uma data em março, e somar 1 ano a uma data em fevereiro também pode resultar em uma data em março:

```php
$d = new DateTime();
// muda para 31 de janeiro de 2016
$d->setDate(2016, 1, 31);
// somar 1 mês = 2 de março de 2016
$d->add(new DateInterval("P1M"));

// muda para 29 de fevereiro de 2016
$d->setDate(2016, 2, 29);
// somar 1 ano = 1 de março de 2017
$d->add(new DateInterval("P1Y"));
```

O detalhe é que `DateInterval` recebe uma string que representa uma [duração no formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations). No caso, `P1M` corresponde a uma duração de 1 mês, e `P1Y` corresponde a uma duração de 1 ano.

Diferente do que ocorre em Java e .NET, a classe `DateTime` não é imutável, portanto o método `add` muda os valores da própria instância, não sendo necessário atribuir o seu valor em outra variável.

O método `add` só foi introduzido no PHP 5.3.0. Para a versão 5.2.0, uma alternativa é usar o método [`modify`](https://www.php.net/manual/en/datetime.modify.php): `$d->modify('+1 month');`. E para versões anteriores, existe a função [`strtotime`](https://www.php.net/manual/en/function.strtotime.php):

```php
echo date('d/m/Y', strtotime('2016-01-31 + 1 months')); // 02/03/2016
```

Lembrando que `strtotime` retorna um timestamp, que em seguida é passado para [`date`](https://www.php.net/manual/en/function.date.php), que por sua vez retorna uma **string** (e não uma data). No caso, a string contém a data no formato "dia/mês/ano".

De qualquer forma, nenhum destes métodos faz o ajuste semântico. Caso você queira este comportamento, [terá que fazer manualmente](https://stackoverflow.com/q/5760262).

### JavaScript

Em JavaScript você pode usar [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Mas infelizmente [o mesmo método que usamos para somar dias]({{ site.baseurl }}{% post_url 2019-04-06-nao-reinvente-a-roda-como-somar-dias-a-uma-data %}#javascript){: class="new-window" } não funciona com meses e anos:

```javascript
let d = new Date(2016, 0, 31); // 31 de janeiro de 2016
// somar 1 mês = 2 de março de 2016
d.setMonth(d.getMonth() + 1);

// 29 de fevereiro de 2016
d = new Date(2016, 1, 29);
// somar 1 ano = 1 de março de 2017
d.setFullYear(d.getFullYear() + 1)
```

Assim como acontece com `java.util.Calendar`, os meses são indexados em zero. E da mesma forma que o PHP, não são feitos os devidos ajustes para manter a semântica.

Neste caso, uma alternativa (que não seja fazer um monte de `if`'s para tratar estes casos) é usar o [Moment.js](https://momentjs.com), que consegue fazer as operações de somar meses e anos fazendo os ajustes necessários para manter a semântica.

```javascript
// 31 de janeiro de 2016
let d = moment([2016, 0, 31]);
// somar 1 mês = 29 de fevereiro de 2016
d.add(1, 'month');
// somar 1 ano = 28 de fevereiro de 2017
d.add(1, 'year');
```

---

A grande vantagem de usar uma API de datas é que ela já trata dos casos especiais. Você só terá um problema se quiser um comportamento diferente (como o ajuste semântico em linguagens que não o fazem, ou vice-versa). E como já dito na [parte 1]({{ site.baseurl }}{% post_url 2019-04-06-nao-reinvente-a-roda-como-somar-dias-a-uma-data %}){: class="new-window" }, se você está tentando implementar essas operações manualmente, mas apenas como um exercício com fins puramente educacionais, é um desafio interessante. Mas se for para código que vai para a produção, não invente. Use uma API de datas para somar os meses e anos e pronto.
