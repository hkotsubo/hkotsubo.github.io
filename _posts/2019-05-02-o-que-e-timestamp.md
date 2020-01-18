---
layout: custompost
title: "O que é o timestamp?"
date: 2019-05-02 21:30:00 -0300
categories: data timestamp
description: Provavelmente você já ouviu falar em "data em milissegundos" ou algo assim. Esse é o tal do timestamp, vamos entender o que ele realmente é?
show_desc: true
comments: true
---

Provavelmente você já teve que lidar com datas e esbarrou em valores como 1556322834 ou 1556322834401. Talvez tenham te falado que guardar esses valores é melhor que guardar a data, e você meio que acreditou, afinal, "o código funciona". Mas o que são esses números?

Esses números [possuem vários nomes](https://codeofmatt.com/please-dont-call-it-epoch-time/): *Unix timestamps*, *Unix Time*, ou simplesmente *timestamps* (que é o nome que usaremos a partir de agora). Um timestamp basicamente representa um instante único, um ponto específico na linha do tempo, e seu valor corresponde a uma determinada quantidade de tempo decorrida a partir de um instante inicial.

Esse instante inicial (o "instante zero") é chamado de [*Unix Epoch*](https://en.wikipedia.org/wiki/Unix_time), cujo valor é `1970-01-01T00:00Z` (1 de janeiro de 1970, à meia-noite, em [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) [^utc]). E o timestamp geralmente tem seu valor em segundos ou milissegundos, podendo ser um número positivo (para instantes que ocorrem depois do *Unix Epoch*) ou negativo (para instantes anteriores ao *Unix Epoch*).

  [^utc]: Lembrando que "meia-noite em UTC" não significa "meia-noite" em todos os lugares. Cada fuso-horário do mundo possui um horário diferente com relação a UTC (o Horário de Brasília, por exemplo, é 3 horas a menos em relação a UTC).

O timestamp 1556322834, por exemplo, representa um instante ocorrido 1556322834 segundos depois do *Unix Epoch*, que corresponde a `2019-04-26T23:53:54Z` (26 de abril de 2019, às 23:53:54 **em UTC**).

Um detalhe importante é que o timestamp representa um único instante, **que é o mesmo no mundo todo**. Muitas linguagens e APIs possuem funções para retornar "a data atual", mas retornam o valor do timestamp. E qualquer computador do mundo que rodasse uma dessas funções, naquele exato instante, obteria o mesmo valor (1556322834)[^secs].

  [^secs]: Algumas linguagens e APIs retornam o valor em segundos, enquanto outras retornam o valor em milissegundos (ou em microssegundos, ou até mesmo nanossegundos - sempre leia a documentação para saber qual a precisão máxima suportada). Mas a ideia geral é a mesma: quaisquer computadores do mundo - assumindo que estão configurados corretamente - rodando ao mesmo tempo, obtêm o mesmo valor do timestamp para a "data atual".

O detalhe é que um mesmo valor de timestamp corresponde a uma data e hora diferente, dependendo do fuso-horário. O timestamp 1556322834, por exemplo, corresponde às seguintes datas e horários:

| Data e hora                  |  Fuso horário
|------------------------------|----------------
| 26/04/2019, às 20:53:54      | São Paulo
| 26/04/2019, às 16:53:54      | Los Angeles
| **27**/04/2019, às 08:53:54  | Tóquio

Este é um conceito importantíssimo: o timestamp 1556322834 corresponde a **todas** as datas e horas acima. O instante é o mesmo (1556322834 segundos depois do *Unix Epoch*), o que muda é apenas a data e hora local, de acordo com o fuso-horário que você usa como referência.

Por isso, só faz sentido converter um timestamp para uma data e hora (e vice-versa) se você estiver usando um fuso-horário específico. Muitas linguagens possuem funções que fazem essas conversões sem pedir por um fuso-horário, mas no fundo elas usam algum predefinido (geralmente o *default* que está configurado no ambiente em que o código roda). Algumas permitem que você mude ou configure o fuso-horário, mas nem sempre isso é possível.

A seguir seguem alguns exemplos básicos de manipulação do timestamp em algumas linguagens. Se quiser, pode usar os links abaixo para ir direto para a linguagem de sua preferência:

{% include languages.html languages="java,net,python,php,javascript" %}

### Java

Se você estiver usando o Java >= 8, use a [API `java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html). Para representar um timestamp, você pode usar a classe [`java.time.Instant`](https://docs.oracle.com/javase/8/docs/api/java/time/Instant.html):

```java
// timestamp correspondente ao instante atual
Instant agora = Instant.now();
// timestamp em segundos - 2019-04-26T23:53:54Z
Instant instant = Instant.ofEpochSecond(1556322834);
// timestamp em milissegundos - 2019-04-26T23:53:54.483Z
Instant instant = Instant.ofEpochMilli(1556322834483L);
// timestamp em segundos + nanossegundos - 2019-04-26T23:53:54.123456789Z
Instant instant = Instant.ofEpochSecond(1556322834, 123456789);
```

O método [`now()`](https://docs.oracle.com/javase/8/docs/api/java/time/Instant.html#now--) retorna um `Instant` contendo o timestamp atual. As classes da API `java.time` possuem precisão de nanossegundos (9 casas decimais na fração de segundos), mas o método `now()` usa o "melhor relógio disponível no sistema". No Java 8, o "melhor relógio disponível" é o método [`System.currentTimeMillis()`](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#currentTimeMillis--), portanto `Instant.now()` retornará um timestamp com precisão de milissegundos (mesmo que a JVM esteja rodando em uma máquina cujo relógio tenha precisão maior). A partir do Java 9 este método de fato usa a mesma precisão que o relógio do sistema possui.

Mas caso você precise **somente** do valor numérico do timestamp atual e nada mais, basta usar `System.currentTimeMillis()`, que retorna esse valor em milissegundos.

Repare que também há métodos para criar um `Instant` a partir de um timestamp em segundos ou milissegundos, além de uma opção para setar também o valor dos nanossegundos (mas independente da forma usada, internamente são mantidos dois valores: a quantidade de segundos e os nanossegundos). Ao imprimir um `Instant` (com `System.out.println` ou com sua API de log favorita), sempre é mostrado a data e hora correspondente em UTC, no formato [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) (ex: `2019-04-26T23:53:54.483Z`).

Para converter um `Instant` para um fuso-horário específico, basta usar um [`java.time.ZoneId`](https://docs.oracle.com/javase/8/docs/api/java/time/ZoneId.html), passando um nome de *timezone* válido:

```java
Instant instant = Instant.ofEpochMilli(1556322834483L);
// 2019-04-26T20:53:54.483-03:00[America/Sao_Paulo]
System.out.println(instant.atZone(ZoneId.of("America/Sao_Paulo")));
// 2019-04-27T08:53:54.483+09:00[Asia/Tokyo]
System.out.println(instant.atZone(ZoneId.of("Asia/Tokyo")));
```

Os nomes `America/Sao_Paulo` e `Asia/Tokyo` são definidos pela [IANA](https://www.iana.org/time-zones) (órgão responsável pelo banco de informações de fusos horários que o Java e muitos outros sistemas, APIs e linguagens usam). Para saber todos os *timezones* disponíveis, use o método [`ZoneId.getAvailableZoneIds()`](https://docs.oracle.com/javase/8/docs/api/java/time/ZoneId.html#getAvailableZoneIds--).

O método [`atZone`](https://docs.oracle.com/javase/8/docs/api/java/time/Instant.html#atZone-java.time.ZoneId-) retorna um [`java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html), que possui uma data, hora e timezone (portanto, representa uma data e hora em um fuso horário específico).

---
Para converter uma data (somente o dia, mês e ano) para um timestamp, é preciso definir um horário e um timezone. Lembre-se que o timestamp representa um instante único, um ponto na linha do tempo. Tendo somente o dia, não é possível obter um único valor de timestamp, já que um dia possui várias horas e portanto corresponde a vários instantes diferentes. Tendo o dia e horário, também não é possível obter o timestamp, já que uma data e hora pode corresponder a um instante diferente em cada parte do mundo (por exemplo, 26 de abril de 2019 às 22h ocorreu em um instante diferente em cada parte do mundo).

A API `java.time` é feita de modo que te "obriga" a fornecer estas informações. Ou seja, se eu tenho um [`java.time.LocalDate`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html) (uma classe que possui somente o dia, mês e ano) e quero transformá-la em um `Instant`, eu devo fornecer o horário e o timezone:

```java
LocalDate data = LocalDate.of(2019, 4, 26); // 26 de abril de 2019
Instant instant = data
    .atTime(10, 30) // 10:30 da manhã
    .atZone(ZoneId.of("America/Sao_Paulo")) // setar o timezone
    .toInstant(); // obter o Instant
```

Dependendo do horário e timezone escolhido, o valor do `Instant` será diferente. Por um lado, é um pouco trabalhoso setar o horário e timezone, mas por outro lado a API te força a pensar da maneira correta com relação aos conceitos de datas, horas e timestamps, além de permitir que você tenha um controle maior sobre os valores usados (algo que muitas APIs não permitem, por exemplo, pois usam valores predefinidos e nem sempre permitem que você mude).

---
Para Java <= 7, existe a API legada: [`java.util.Date`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html) e [`java.util.Calendar`](https://docs.oracle.com/javase/8/docs/api/java/util/Calendar.html).

`Date`, apesar do nome, não é uma data (um dia, mês e ano específicos). Na verdade, esta classe representa um timestamp. O que pode confundir é que, ao imprimir um `Date`, ele converte o timestamp para o timezone *default* da JVM e mostra a data e hora correspondente. Exemplo:

```java
Date data = new Date(1556322834483L);
TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
System.out.println(data.getTime() + "=" + data);
TimeZone.setDefault(TimeZone.getTimeZone("Asia/Tokyo"));
System.out.println(data.getTime() + "=" + data);
```

Eu uso [`TimeZone.setDefault`](https://docs.oracle.com/javase/8/docs/api/java/util/TimeZone.html#setDefault-java.util.TimeZone-) para mudar o timezone default da JVM, e em seguida imprimo o valor de [`getTime()`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html#getTime--) (que retorna o timestamp) e o próprio `Date` (que usará o timestamp default para converter o timestamp para uma data e hora). O resultado é:

```
1556322834483=Fri Apr 26 20:53:54 BRT 2019
1556322834483=Sat Apr 27 08:53:54 JST 2019
```

Repare que o valor do timestamp é o mesmo, mas a data e hora não. O valor do `Date` (o timestamp) não é alterado, mas quando este é impresso, o timestamp é convertido para o timezone default que está setado no momento. Isso é algo que confunde **muita** gente: o `Date` só possui o valor do timestamp, nada mais. Qualquer outro valor (dia, mês, ano , hora, minuto, segundo) é derivado do timestamp, levando em conta o timezone default da JVM. Mas o `Date` em si não possui tais valores.

---
Para converter uma data específica (dia, mês e ano) em um timestamp, basta usar um `Calendar`:

```java
// 26 de abril de 2019, 10:30
Calendar cal = Calendar.getInstance();
cal.set(2019, Calendar.APRIL, 26, 10, 30, 0);
cal.set(Calendar.MILLISECOND, 0);
cal.setTimeZone(TimeZone.getTimeZone("America/Sao_Paulo"));
long timestamp = cal.getTimeInMillis(); // 1556285400000
```

No exemplo acima foram setados o horário e o timezone, mas a API não nos obriga a fazer isso. `Calendar.getInstance()` cria uma instância contendo a data e hora atual no timezone *default* da JVM, e se você só mudar o dia, mês e ano, os outros campos permanecem os mesmos, e isso faz com que o valor do timestamp retornado seja diferente.

### .NET

Em .NET existe o *struct* [`DateTime`](https://docs.microsoft.com/en-us/dotnet/api/system.datetime?view=netframework-4.8#main), mas ele não usa *Unix timestamps*. Na verdade ele usa um *epoch* diferente, ou seja, o instante zero não é o *Unix Epoch*, e sim `0001-01-01T00:00Z` (1 de janeiro do **ano 1**, à meia-noite em UTC). E a unidade de medida usada é chamada de *tick*, que equivale a 100 nanossegundos (ou 0,0000001 segundos). Por isso há [vários construtores](https://docs.microsoft.com/en-us/dotnet/api/system.datetime.-ctor?view=netframework-4.8) que recebem a quantidade de ticks e criam o `DateTime` correspondente.

Para trabalhar com *Unix timestamps*, existe o *struct* [`DateTimeOffset`](https://docs.microsoft.com/en-us/dotnet/api/system.datetimeoffset?view=netframework-4.8), que possui o método [`FromUnixTimeSeconds`](https://docs.microsoft.com/en-us/dotnet/api/system.datetimeoffset.fromunixtimeseconds?redirectedfrom=MSDN&view=netframework-4.8#System_DateTimeOffset_FromUnixTimeSeconds_System_Int64_), que recebe o timestamp em segundos. Também existe o método [`FromUnixTimeMilliseconds`](https://docs.microsoft.com/en-us/dotnet/api/system.datetimeoffset.fromunixtimemilliseconds?view=netframework-4.8) que recebe o timestamp em milissegundos:

```c#
DateTimeOffset d = DateTimeOffset.FromUnixTimeMilliseconds(1556322834483);
Console.WriteLine(d); // 4/26/19 11:53:54 PM +00:00
```

Se quiser, também pode usar `d.DateTime` para obter o `DateTime` correspondente. E caso queira transformar uma data específica em um timestamp, basta fazer o processo inverso, criando um `DateTimeOffset` a partir de um `DateTime`:

```c#
DateTime dt = new DateTime(2019, 4, 26, 10, 30, 0);
DateTimeOffset d = new DateTimeOffset(dt);
Console.WriteLine(d.ToUnixTimeSeconds()); // 1556285400
```

No exemplo acima o retorno foi 1556285400 (que corresponde a 26/04/2019 às 10:30 no Horário de Brasília), pois o valor de `dt.Kind` acima é `Unspecified`, e neste caso o `DateTimeOffset` usa o timezone configurado no sistema (e o meu sistema está usando o Horário de Brasília). Para mais detalhes e opções, [veja este link](https://stackoverflow.com/q/249760).

E para obter o timestamp atual (somente o valor numérico e nada mais):

```c#
Console.WriteLine(DateTimeOffset.UtcNow.ToUnixTimeSeconds());
Console.WriteLine(((DateTimeOffset) DateTime.UtcNow).ToUnixTimeSeconds());
```

### Python

Em Python você pode usar o módulo [`datetime`](https://docs.python.org/3/library/datetime.html), que possui o método [`fromtimestamp`](https://docs.python.org/3/library/datetime.html#datetime.datetime.fromtimestamp) para criar uma data a partir de um timestamp:

```python
from datetime import datetime

d = datetime.fromtimestamp(1556322834.483)
print(d) # 2019-04-26 20:53:54.483000
```

O valor do timestamp deve estar em segundos, mas o método `fromtimestamp` aceita valores com frações de segundos (no exemplo acima, este valor é `.483`, ou seja, 483 milissegundos). O limite da API é microssegundos (6 casas decimais), e valores com mais que 6 casas decimais são arredondados (ex: `datetime.fromtimestamp(1556322834.483199999)` resulta em `2019-04-26 20:53:54.483200`).

O detalhe é que por *default* é usado o timezone do sistema para converter o timestamp para uma data e hora. No meu caso, o timezone da minha máquina é `America/Sao_Paulo`, mas [rodando esse mesmo código no Ideone.com](https://ideone.com/y7bWxp), o resultado foi `2019-04-26 23:53:54.483000` (pois o timezone do servidor deles é UTC).

Ou seja, dependendo da configuração do ambiente no qual o código está rodando, você pode obter uma data e hora diferentes. Para não depender desta configuração e usar um timezone específico, uma alternativa é usar o [módulo `pytz` (disponível no PyPI)](https://pypi.org/project/pytz/):

```python
from datetime import datetime
from pytz import timezone

# obter a data e hora em um timezone específico
d = datetime.fromtimestamp(1556322834.483199999, tz=timezone('America/Sao_Paulo'))
print(d)  # 2019-04-26 20:53:54.483200-03:00

# obter o timestamp a partir de uma data/hora e timezone
d = timezone('America/Sao_Paulo').localize(datetime(2019, 4, 26, 10, 30, 0, 0))
print(d.timestamp()) # 1556285400.0
```

Repare que agora, ao imprimir o `datetime`, também é mostrado o offset `-03:00` (que é a diferença em relação a UTC, que o timezone `America/Sao_Paulo` usa naquele instante específico). No código acima também há um exemplo para converter uma data e hora específicas em um timestamp (lembrando que o timezone utilizado faz com que o valor do timestamp seja diferente, já que a mesma data e hora acontece em instantes diferentes em cada parte do mundo). E se você usar apenas o construtor de `datetime` (sem usar nenhum timezone), o retorno de `timestamp()` usará o timezone do ambiente no qual o código está rodando (e portanto pode variar).

Usar um timezone é importante para que o código não fique dependente da configuração de timezone do ambiente no qual o código roda - a menos que este seja o comportamento desejado, claro. Mas se quiser que o timestamp corresponda a uma data e hora em um timezone específico, é melhor usar o `pytz`. As informações de timezones mudam o tempo todo (há épocas em que há horário de verão e o offset muda, [entre outros detalhes explicados neste link](https://pt.stackoverflow.com/a/349822/112052)), e tentar manter isso manualmente é inviável. O `pytz` é atualizado de acordo com as versões do [TZDB da IANA](https://www.iana.org/time-zones) (o banco de informações de fusos-horários que várias linguagens e sistemas usam) e basta você usar o timezone correto (como `America/Sao_Paulo`, `Europe/London`, etc), que o `pytz` se encarrega de verificar qual a data e hora correspondentes.

E caso você precise somente do timestamp atual (o valor numérico e nada mais), pode usar o [método `time`](https://docs.python.org/3/library/time.html#time.time):

```python
import time
# valor do timestamp atual em segundos (e contendo as frações de segundos)
print(time.time())
```

### PHP

Em PHP você pode usar a [classe `DateTime`](https://www.php.net/manual/en/class.datetime.php). Para obter uma instância a partir de um timestamp, você pode fazer de duas maneiras:

```php
// criar um DateTime correspondente ao timestamp 1556322834
$d = DateTime::createFromFormat('U', 1556322834);
// ou
$d = new DateTime('@'. 1556322834);
```

Em ambos os casos, o timestamp 1556322834 está em segundos, e a data e hora resultante estará em UTC (e neste caso, não adianta mudar o timezone *default* com [`date_default_timezone_set`](https://www.php.net/manual/en/function.date-default-timezone-set.php), pois este é ignorado quando um timestamp é usado). Se você fizer um `var_dump($d)`, a saída será:

```
object(DateTime)#10 (3) {
  ["date"]=>
  string(26) "2019-04-26 23:53:54.000000"
  ["timezone_type"]=>
  int(1)
  ["timezone"]=>
  string(6) "+00:00"
}
```

O offset `+00:00` indica que de fato o `DateTime` está em UTC. Se quiser que ela esteja em um timezone específico, basta passar um [`DateTimeZone`](https://www.php.net/manual/en/class.datetimezone.php) como parâmetro:

```php
$d = DateTime::createFromFormat('U', 1556322834);
$d->setTimezone(new DateTimeZone('America/Sao_Paulo'));
// ou
$d = new DateTime('@'. 1556322834);
$d->setTimezone(new DateTimeZone('America/Sao_Paulo'));
```

Um detalhe chato é que no construtor, o timestamp exige que se tenha o `@` antes (veja o campo "Unix Timestamp" na [documentação](https://www.php.net/manual/en/datetime.formats.compound.php)) Em ambos os casos, a saída será:

```
object(DateTime)#10 (3) {
  ["date"]=>
  string(26) "2019-04-26 20:53:54.000000"
  ["timezone_type"]=>
  int(3)
  ["timezone"]=>
  string(17) "America/Sao_Paulo"
}
```

Ao ajustar o timezone, os valores de data e hora também são alterados de acordo com as regras do timezone utilizado. Um detalhe interessante é que usando [`createFromFormat`](https://www.php.net/manual/en/datetime.createfromformat.php) também é possível usar valores com frações de segundos (limitado a 6 casas decimais):

```php
# timestamp correspondente a 1556322834 segundos e 123456 microssegundos
$d = DateTime::createFromFormat('U.u', '1556322834.123456');
```

---
Para obter o valor do timestamp a partir de uma data, hora e timezone específicos, também é simples:

```php
$d = new DateTime();
$d->setTimezone(new DateTimeZone('America/Sao_Paulo'));
$d->setDate(2019, 4, 26); // 26 de abril de 2019
$d->setTime(10, 30); // 10:30 da manhã 
echo $d->getTimestamp(); // 1556285400

// ou
$d = new DateTime('2019-04-26T10:30', new DateTimeZone('America/Sao_Paulo'));
echo $d->getTimestamp(); // 1556285400
```

Atenção para chamar `setTimezone` antes de `setDate` e `setTime`. Se você mudar a data e hora primeiro, as alterações serão feitas levando em conta o timezone *default*. Depois, ao mudar o timezone, a data e hora serão ajustadas de acordo com o novo timezone, que não necessariamente serão os mesmos que você setou.

Por fim, se você precisa **apenas** do valor numérico do timestamp atual, basta usar a função [`time()`](https://php.net/manual/en/function.time.php), que retorna o timestamp em segundos.

---
E a função [`strtotime`](https://php.net/manual/en/function.strtotime.php)? Bem, ela também funciona (`strtotime('now')` retorna o mesmo que `time()`), e muitos costumam usar em conjunto com [`date`](https://php.net/manual/en/function.date.php):

```php
date_default_timezone_set('America/Sao_Paulo');
echo(date('d/m/Y H:i:s', strtotime('now')));
```

No caso, `strtotime` retorna o timestamp, e `date` converte este timestamp para uma data e hora específicas, retornando uma string no formato indicado. No exemplo acima, o retorno é a data e hora atual no formato "dia/mês/ano hora:minuto:segundo" (atenção para o fato de que `date`, apesar do nome, retorna uma **string** - se quiser um objeto que represente uma data, use `DateTime`).

O detalhe é que `date` usa o timezone *default* que está setado no momento. Se eu quiser que ela use um timezone específico, devo mudá-lo com `date_default_timezone_set`. Só que isso afeta todas as demais funções que usam o timezone *default*. Já usando a solução anterior com `DateTime`, eu mudo somente o timezone das instâncias com as quais estou trabalhando, sem mudar a configuração do PHP.

### JavaScript

Em JavaScript você pode usar [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), passando o timestamp para o construtor. O detalhe é que o valor deve estar em milissegundos:

```javascript
let d = new Date(1556322834000);
console.log(d);
```

A data e hora que será mostrada depende do timezone que está configurado no browser (que geralmente é obtido do sistema operacional) e não há muito mais o que fazer para controlar isso. O melhor que dá para fazer é gerar uma string contendo a data e hora correspondentes em um timezone específico:

```javascript
console.log(d.toLocaleString('pt-BR', { timeZone: 'America/Los_Angeles' }));
console.log(d.toLocaleString('pt-BR', { timeZone: 'Asia/Tokyo' }));
```

Com isso, é usado o formato correspondente ao locale `pt-BR` (que deve estar instalado no sistema, caso contrário será usado o locale *default* que estiver configurado no browser), e os valores de data e hora são obtidos a partir do timezone indicado. A saída é:

```
26/04/2019 16:53:54
27/04/2019 08:53:54
```

Para obter o valor do timestamp a partir de uma data e hora específica, você pode passar os valores diretamente para o construtor, e em seguida usar o método `getTime()`, que retorna o timestamp em milissegundos:

```javascript
let d = new Date(2019, 3, 26, 10, 30);
console.log(d.getTime());
```

O detalhe é que é usado o timezone do browser, e não há como controlar isso.

---
Uma opção para controlar o timezone é usar o [Moment.js](https://momentjs.com/), juntamente como o [Moment Timezone](https://momentjs.com/timezone/). Com isso, você pode escolher o timezone para o qual o timestamp será convertido:

```javascript
moment.tz(1556322834000, "America/Los_Angeles").format() // 2019-04-26T16:53:54-07:00
moment.tz(1556322834000, "America/Sao_Paulo").format()   // 2019-04-26T20:53:54-03:00
```

Repare que o valor do timestamp está em milissegundos. Também é possível obter o timestamp corresponde a uma data e hora, em um timezone específico:

```javascript
moment.tz("2019-04-26 10:30", "America/Los_Angeles").valueOf()  // 1556299800000
moment.tz("2019-04-26 10:30", "America/Sao_Paulo").valueOf()    // 1556285400000
```

O método [`valueOf()`](https://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/) retorna o valor do timestamp em milissegundos. Os valores são diferentes porque as 10:30 do dia 26/04/2019 ocorreram em instantes diferentes em Los Angeles e São Paulo.

Se quiser este mesmo valor em segundos, use o método [`unix()`](https://momentjs.com/docs/#/displaying/unix-timestamp/). E se quiser o valor numérico do timestamp atual, basta fazer `new Date().getTime()`.

---
Enfim, todas as linguagens possuem algum suporte a datas, horas, timezones e timestamps (algumas melhores, outras piores). Sempre que for converter uma data e hora de/para um timestamp, é importante saber qual o timezone que está sendo utilizado. Como você pôde perceber, esta informação nem sempre está clara: muitas vezes é usado um timezone *default* (que nem sempre dá para saber facilmente qual é) e algum valor sempre é retornado - e como não dá erro, muitos assumem que "funcionou", sem sequer conferir se os **valores** estão corretos.

Não há mágica: um timestamp corresponde a uma data e hora específicas em cada timezone. Se foi retornado um timestamp, é porque as 3 informações (data, hora e timezone) estavam presentes. Se você não forneceu alguma(s) dela(s), então algum valor *default* foi usado. É comum, por exemplo, APIs que só recebem dia, mês e ano e retornam um timestamp. Nesse caso, algum valor foi usado para o horário (a maioria usa meia-noite) e para o timezone (o *default* que está configurado "no sistema"). Em alguns casos este comportamento é documentado, e dependendo da API, isso pode ser configurado ou alterado programaticamente. Sempre leia a documentação e confira os valores retornados. Não aceite qualquer data só porque "funcionou".