---
layout: custompost
title: "Meu JSON retornou a data /Date(1555375534143-0300)/, o que eu faço?"
date: 2020-01-18 15:00:00 -0300
categories: data json timestamp
description: Às vezes aparece uma data retornada como "/Date(1555375534143-0300)/". Este é um dos piores formatos de data já criados, mas não é impossível de interpretá-lo, vamos lá?
show_desc: true
comments: true
---

Este formato é conhecido como [Microsoft JSON Date](https://davidsekar.com/javascript/converting-json-date-string-date-to-date-object), já que algumas versões mais antigas do Framework .NET serializavam datas neste formato (embora não pareça ser um "nome oficial", mas muitos o conhecem assim).

É importante salientar que ele **não** faz parte da [especificação oficial do formato JSON](http://json.org/). Conforme já explicado [neste outro post]({{ site.baseurl }}{% post_url 2019-04-13-como-ler-e-manipular-um-json %}){: class="new-window" }, um JSON possui vários tipos definidos, como números e strings, mas não possui nenhum tipo específico para datas. Portanto, o valor em questão (`/Date(1555375534143-0300)/`) **é na verdade uma string**. Cabe a você transformar esta string em uma data.

# Como interpretar este formato

Este valor pode vir como `/Date(1555375534143-0300)/` ou `/Date(1555375534143)/`. As barras, parênteses e a palavra "Date" são sempre fixas, e o que importa de fato é o que está dentro dos parênteses.

O número gigante (`1555375534143`) é um [timestamp]({{ site.baseurl }}{% post_url 2019-05-02-o-que-e-timestamp %}){: class="new-window" } **←** Neste link há uma descrição bem detalhada (recomendo a leitura caso você não saiba o que é um timestamp), mas apenas para resumir:

- o timestamp representa um único instante, um ponto específico na linha do tempo (a quantidade de tempo decorrida desde o "instante zero", também conhecido como *Unix Epoch* - que corresponde a 1 de janeiro de 1970, à meia-noite, em [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time))
- ele pode corresponder a uma data e hora diferente em cada parte do mundo (ou seja, depende do fuso horário)
- o timestamp é tradicionalmente representado em segundos ou milissegundos, e no caso deste post, o valor está em milissegundos

O segundo ponto é importante, pois para converter o timestamp para uma data, você precisa saber qual timezone (fuso horário) será usado, já que em cada timezone o resultado será uma data e hora diferente (você leu [o link que eu sugeri]({{ site.baseurl }}{% post_url 2019-05-02-o-que-e-timestamp %}){: class="new-window" }, né? Lá explica isso em detalhes). Por exemplo, o timestamp `1555375534143` corresponde às seguintes datas e horas:

| Data e hora                      |  Fuso horário
|---------------------------- -----|----------------
| 15/04/2019, às 21:45:34.143      | São Paulo
| 15/04/2019, às 17:45:34.143      | Los Angeles
| **16**/04/2019, às 09:45:34.143  | Tóquio
| **16**/04/2019, às 00:45:34.143  | UTC



Todas as datas e horas acima correspondem ao mesmo timestamp (`1555375534143`), portanto, ao fazer a conversão é necessário saber qual o timezone sendo usado.

O segundo valor (`-0300`) é um *offset*, ou seja, a diferença em relação a [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time). No caso, `-0300` significa 3 horas a menos que o UTC, que é o offset usado em São Paulo naquele instante.

Dito isso, como interpretar valores como `/Date(1555375534143-0300)/` ou `/Date(1555375534143)/`? Depende.

Você pode pegar somente o timestamp e ignorar o _offset_, e em seguida converter o timestamp para uma data e hora, usando algum timezone qualquer. Ou você pode usar o _offset_ que foi passado para fazer esta conversão (e usar UTC, ou algum timezone *default*, caso não haja um _offset_). Ou você pode simplesmente usar o valor do timestamp (`1555375534143`) da forma que está. Tudo depende do que você quer ou precisa fazer.

Para extrair os valores, você pode usar tanto `substring` quanto expressões regulares (_regex_), e dependendo da linguagem, é possível fazer o *parsing* diretamente, usando uma API de datas. Abaixo tem exemplos em algumas das linguagens que conheço (com uma ênfase maior em Java, pois é a API que tenho mais familiaridade). Se quiser, pode usar os links abaixo para ir direto para a linguagem de sua preferência:

{% include languages.html languages="java,net,python,php,javascript" %}

### Java

Se você estiver usando o Java >= 8, use a [API `java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html). Com um [`java.time.format.DateTimeFormatterBuilder`](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatterBuilder.html), é possível construir um [`java.time.format.DateTimeFormatter`](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html) que faz o *parsing* deste formato.

```java
DateTimeFormatter parser = new DateTimeFormatterBuilder()
    // parte inicial
    .appendLiteral("/Date(")
    // para o timestamp, usa-se o InstantSeconds e os milissegundos
    .appendValue(ChronoField.INSTANT_SECONDS)
    .appendValue(ChronoField.MILLI_OF_SECOND, 3)
    // offset opcional (colchetes indicam que o campo é opcional)
    .appendPattern("[XX]")
    // se não tiver offset, assume-se que é zero (UTC)
    .parseDefaulting(ChronoField.OFFSET_SECONDS, 0)
    // parte final, e cria o DateTimeFormatter
    .appendLiteral(")/").toFormatter();
OffsetDateTime odt1 = OffsetDateTime.parse("/Date(1555375534143)/", parser);
System.out.println(odt1); // 2019-04-16T00:45:34.143Z
OffsetDateTime odt2 = OffsetDateTime.parse("/Date(1555375534143-0300)/", parser);
System.out.println(odt2); // 2019-04-15T21:45:34.143-03:00
```

No exemplo acima eu uso [`java.time.temporal.ChronoField`](https://docs.oracle.com/javase/8/docs/api/java/time/temporal/ChronoField.html) para definir o trecho que obtém o timestamp. São usados [`INSTANT_SECONDS`](https://docs.oracle.com/javase/8/docs/api/java/time/temporal/ChronoField.html#INSTANT_SECONDS), que captura o trecho `1555375534`, e [`MILLI_OF_SECONDS`](https://docs.oracle.com/javase/8/docs/api/java/time/temporal/ChronoField.html#MILLI_OF_SECOND), que captura o trecho `143`.

Depois, é feito o *parsing* para um [`java.time.OffsetDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/OffsetDateTime.html), que possui a data, hora e _offset_. Quando a entrada possui um _offset_, eu uso o respectivo valor, mas quando não tem _offset_, por padrão eu uso zero (que corresponde a UTC).

Com isso, eu tenho o valor do timestamp e o _offset_, e internamente o método `parse` faz as devidas conversões para gerar a data e hora correspondentes. Repare que isso faz com que os valores de data e hora mudem no resultado final, por isso é importante definir qual _offset_ ou timezone será usado.

Se quiser o valor numérico do timestamp, use `odt1.toInstant().toEpochMilli()` (também funciona com `odt2`, pois ambos correspondem ao mesmo instante - e portanto, ao mesmo timestamp). Já para obter o _offset_, você pode usar:

```java
ZoneOffset offset = odt2.getOffset();
System.out.println(offset.getTotalSeconds()); // -10800
System.out.println(Duration.ofSeconds(offset.getTotalSeconds()).toHours()); // -3
```

Neste caso, há diferença em usar `odt1` ou `odt2`, pois o primeiro está em UTC (offset zero) e o segundo está no _offset_ `-03:00` (3 horas a menos que UTC). O método [`getTotalSeconds()`](https://docs.oracle.com/javase/8/docs/api/java/time/ZoneOffset.html#getTotalSeconds--) retorna o valor total do _offset_ em segundos (no caso acima, `-10800`, que corresponde a "menos 3 horas").

Também é usado um [`java.time.Duration`](https://docs.oracle.com/javase/8/docs/api/java/time/Duration.html) para converter o valor dos segundos para horas, resultando em `-3`. Mas atenção, o método [`toHours()`](https://docs.oracle.com/javase/8/docs/api/java/time/Duration.html#toHours--) arredonda o valor e isso pode fazer diferença para casos em que o _offset_ não é de horas inteiras (como ocorre por exemplo na Índia, que atualmente usa o _offset_ `+05:30` - 5 horas e meia à frente do UTC). Para obter o valor exato do _offset_, melhor usar `getTotalSeconds()`.

Lembrando que, como o _offset_ não é o mesmo, `odt1.getOffset().getTotalSeconds()` retornará zero, já que ele foi obtido da string `/Date(1555375534143)/`, que não possui _offset_, e no nosso `DateTimeFormatter` foi definido que neste caso usa-se o _offset_ zero.

Se você estiver usando Java 6 e 7, pode usar o [Threeten Backport](https://www.threeten.org/threetenbp/), um *backport* do `java.time`. Ele basicamente possui as mesmas classes e métodos do `java.time`, a diferença é que o nome do pacote é `org.threeten.bp`. Ou seja, com exceção dos `import`'s, o código ficará igual ao do exemplo acima.

---
Obviamente, você também pode usar a API legada ([`java.util.Date`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html) e [`java.text.SimpleDateFormat`](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html)). Infelizmente, com esta API não é possível fazer algo tão direto quanto o exemplo acima com `DateTimeFormatter`, então o jeito é extrair as informações diretamente da `String`. Uma das opções é usar regex, através do pacote `java.util.regex`:

```java
// Matcher e Pattern fazem parte do pacote java.util.regex
Matcher matcher = Pattern.compile("/Date\\((\\d+)([-+]\\d{4})?\\)/")
                         .matcher("/Date(1555375534143)/");
if (matcher.find()) {
    long timestamp = Long.parseLong(matcher.group(1));
    String offset = matcher.group(2);
    if (offset == null) { // se não tem offset, usa zero
        offset = "+0000";
    }

    // se quiser um java.util.Date, pode parar por aqui
    Date date = new Date(timestamp);

    // se quiser obter uma String com a data e hora correspondente no offset em questão
    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss XXX");
    // usar o offset para converter o Date em uma data e hora
    sdf.setTimeZone(TimeZone.getTimeZone("GMT" + offset));
    System.out.println(sdf.format(date)); // 16/04/2019 00:45:34 Z
} else {
    System.out.println("String não está no formato correto");
}
```

A lógica geral é a mesma: tenta-se obter o timestamp e o _offset_ da `String`. Caso o _offset_ não esteja presente, algum valor *default* é usado (no caso, estou usando zero). Eu uso `\\d+` para capturar o timestamp (um ou mais dígitos), e para o _offset_ eu uso `[-+]` (o sinal de menos ou de mais) seguido de `\\d{4}` (quatro dígitos), e uso o `?` para dizer que o _offset_ é [opcional](https://www.regular-expressions.info/optional.html). Cada um dos campos está entre parênteses para formar [grupos de captura](https://www.regular-expressions.info/brackets.html), e com isso eu posso obter os respectivos valores usando o método `group` (no caso, o grupo 1 é o timestamp e o grupo 2 é o offset).

A seguir, eu uso o timestamp para criar um `java.util.Date`. E um `Date`, apesar do nome, não representa uma data, e sim um timestamp. Esse é um ponto meio confuso, pois ao imprimir o `Date`, ele usa o timezone *default* da JVM para obter os valores de data e hora. Exemplo:

```java
Date data = new Date(1555375534143L);
TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
System.out.println(data.getTime() + "=" + data);
TimeZone.setDefault(TimeZone.getTimeZone("Asia/Tokyo"));
System.out.println(data.getTime() + "=" + data);
```

No código acima estou imprimindo o timestamp (através do método [`getTime()`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html#getTime--)), e em seguida imprimo a própria data, que internamente chama o método [`toString()`](https://docs.oracle.com/javase/8/docs/api/java/util/Date.html#toString--). A saída é:

```none
1555375534143=Mon Apr 15 21:45:34 BRT 2019
1555375534143=Tue Apr 16 09:45:34 JST 2019
```

Repare que o valor do timestamp é o mesmo, mas o valor retornado por `toString()` não, pois este método usa o timezone *default* que está setado no momento, para converter o timestamp para uma data e hora específicas. Mas o `Date` não possui esses valores de data e hora: internamente, esta classe só possui o valor do timestamp. **Por isso que o construtor de `Date` só precisa do timestamp, e se quisermos apenas uma instância de `Date`, não precisamos do _offset_**.

Mas caso você queira uma `String` contendo a data, hora correspondentes ao timestamp, no offset indicado, basta usar um `SimpleDateFormat`, como o código acima mostra. Ele também usa um [`java.util.TimeZone`](https://docs.oracle.com/javase/8/docs/api/java/util/TimeZone.html) com o valor do _offset_ que foi obtido pela regex. Com isso, a saída é uma `String` que corresponde ao timestamp e ao offset que estavam na entrada.

No exemplo acima, a saída é `16/04/2019 00:45:34 Z` (este "Z" no final [indica que está em UTC](https://en.wikipedia.org/wiki/ISO_8601#Coordinated_Universal_Time_(UTC)) - ou seja, que o _offset_ é zero). Se eu testar com `"/Date(1555375534143-0300)/"`, a saída é `15/04/2019 21:45:34 -03:00`.

Também daria para obter o timestamp e _offset_ usando `substring`, e fazendo alguns `if`'s para saber se o _offset_ existe, mas eu acho que a solução com regex é mais direta nesse caso.

### .NET

Em .NET você pode usar o [Json.NET](https://www.newtonsoft.com/json), que possui a classe [`JsonConvert`](https://www.newtonsoft.com/json/help/html/SerializingJSON.htm#JsonConvert). Com isso podemos obter um [`DateTime`](https://docs.microsoft.com/en-us/dotnet/api/system.datetime?view=netframework-4.8):

```c#
string sa = @"""" + "/Date(1555375534143-0300)/" + @"""";
DateTime dt = JsonConvert.DeserializeObject<DateTime>(sa);
Console.WriteLine(dt); // 4/15/19 9:45:34 PM
```

De forma similar ao que foi feito acima em Java, também podemos obter o timestamp e o _offset_ usando regex, e em seguida usamos um [`DateTimeOffset`](https://docs.microsoft.com/en-us/dotnet/api/system.datetimeoffset?view=netframework-4.8) para obter a data e hora correspondente:

```c#
Regex r = new Regex(@"/Date\((\d+)([-+]\d{4})?\)/");
Match match = r.Match("/Date(1555375534143-0300)/");
if (match.Success)
{
    long timestamp = long.Parse(match.Groups[1].Value);
    TimeSpan offset = TimeSpan.Zero; // offset por padrão é zero
    if(match.Groups[2].Success)
    { // se foi encontrado offset
        string value = match.Groups[2].Value;
        int hours = int.Parse(value.Substring(1, 2));
        if (value.Substring(0, 1).Equals("-"))
        {
            hours = -hours;
        }
        int minutes = int.Parse(value.Substring(3));
        offset = new TimeSpan(hours, minutes, 0);
    }
    DateTimeOffset dt = DateTimeOffset.FromUnixTimeMilliseconds(timestamp).ToOffset(offset);
    Console.WriteLine(dt); // 4/15/19 9:45:34 PM -03:00
}
```

Foi feito um pequeno trabalho com substrings para obter o valor correto do _offset_ como um [`TimeSpan`](https://docs.microsoft.com/en-us/dotnet/api/system.timespan?view=netframework-4.8). Em seguida, usamos o método [`FromUnixTimeMilliseconds`](https://docs.microsoft.com/en-us/dotnet/api/system.datetimeoffset.fromunixtimemilliseconds?view=netframework-4.8), passando o timestamp, e o método [`ToOffset`](https://docs.microsoft.com/en-us/dotnet/api/system.datetimeoffset.tooffset?view=netframework-4.8), que converte para o _offset_ indicado.

### Python

A ideia é a mesma: use regex para obter o timestamp e o _offset_ (ou use UTC quando este não for encontrado), e em seguida crie uma data. No caso, estou usando o [módulo `datetime`](https://docs.python.org/3.6/library/datetime.html) para criar as datas, e o [módulo `re`](https://docs.python.org/3.6/library/re.html) para expressões regulares:

```python
from datetime import datetime, timezone, timedelta
import re

m = re.match(r'/Date\((\d+)([-+]\d{4})?\)/', '/Date(1555375534143-0300)/')
if m:
    timestamp = int(m.group(1))
    offset = m.group(2)
    if offset:
        total = timedelta(hours = int(offset[1:3]), minutes = int(offset[3:]))
        if offset[0] == '-':
            total = -total
        offset = timezone(total)
    else: # não tem o offset, usar UTC
        offset = timezone.utc

    # o timestamp está em milissegundos, mas fromtimestamp recebe o valor em segundos
    data = datetime.fromtimestamp(timestamp / 1000).astimezone(offset)
    print(data) # 2019-04-15 21:45:34.143000-03:00
```

### PHP

Similar aos demais, basta usar uma expressão regular para obter o timestamp e o _offset_:

```php
if (preg_match('/Date\((\d+)([-+]\d{4})?\)/', '/Date(1555375534143-0300)/', $matches)) {
    $timestamp = number_format($matches[1] / 1000, 3, '.', '');
    // $matches pode ter até 3 elementos: o match total e os dois grupos de captura
    if (count($matches) === 3) {
        $offset = $matches[2];
    } else {
        $offset = '+0000';
    }
    $data = DateTime::createFromFormat('U.u', $timestamp);
    $data->setTimeZone(new DateTimeZone($offset));
}
```

Aqui tomamos o cuidado de dividir o timestamp por 1000, pois o formato `U.u` aceita os segundos, seguido de um ponto, seguido das frações de segundo.

Para saber se o _offset_ está presente, eu vejo se o array de *matches* tem 3 posições. Isso porque a primeira posição sempre contém todo o trecho que corresponde à expressão, e as posições subsequentes correspondem aos grupos de captura.

### JavaScript

Por fim, em JavaScript, a ideia é a mesma: usar uma regex para extrair o timestamp e offset, e criar a data:

```javascript
let regex = /Date\((\d+)([-+]\d{4})?\)/;
let match = regex.exec('/Date(1555375534143-0300)/').slice(1, 3);
let data = new Date(parseInt(match[0]));
```

Ao executar a regex, eu pego somente um trecho do array retornado (contendo os dois grupos de captura), já que `exec` retorna um array com mais informações que não me interessam neste caso.

Um detalhe é que o [`Date` do JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) (similar ao `java.util.Date` do Java) representa um [timestamp]({{ site.baseurl }}{% post_url 2019-05-02-o-que-e-timestamp %}){: class="new-window" }, e por isso ele não precisa do offset.

Caso queira a data no offset que está na string, uma alternativa é usar a biblioteca [Moment.js](https://momentjs.com):

```javascript
let regex = /Date\((\d+)([-+]\d{4})?\)/;
let match = regex.exec('/Date(1555375534143-0300)/').slice(1, 3);
let offset = match[1] || '+0000';
let data = moment(parseInt(match[0])).utcOffset(offset);
console.log(data.format()); // 2019-04-15T21:45:34-03:00
```

Outra opção é usar [`parseZone`](https://momentjs.com//docs/#/parsing/parse-zone/), que suporta este formato e consegue preservar o *offset*:

```javascript
console.log(moment.parseZone("/Date(1555375534143-0300)/").format()); // 2019-04-15T21:45:34-03:00
```


---
Resumindo, o formato `/Date(1555375534143-0300)/` pode assustar à primeira vista, mas uma vez que entendemos a sua - falta de - lógica, não é difícil extrair dele os dados que precisamos.