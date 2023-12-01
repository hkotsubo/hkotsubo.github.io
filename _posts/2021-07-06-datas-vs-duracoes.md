---
layout: custompost
title: "Datas/Horas vs Durações"
date: 2021-07-05 19:00:00 -0300
categories: data aritmética
description: Em programação, um erro muito comum ao manipular datas e horas é confundi-las com durações. Apesar de "parecidas" - e relacionadas - elas não são a mesma coisa.
show_desc: true
comments: true
---

Considere as duas frases abaixo:

- A filme passou às duas horas da tarde.
- A filme tem duração de duas horas.

Apesar de ambas usarem "_duas horas_", em cada uma o significado é diferente. Na primeira frase, "duas horas" indica um **horário**: um momento específico do dia. Na segunda frase, "duas horas" indica uma **duração**: uma quantidade de tempo.

Apesar de ambos usarem as mesmas palavras - embora no primeiro caso tenha sido necessário usar "da tarde" para desambiguar - eles são conceitos diferentes. Uma data e/ou um horário **não** é o mesmo que uma duração. Datas representam pontos específicos no calendário e horários representam momentos específicos do dia, e durações são apenas quantidades de tempo, sem necessariamente estarem relacionadas a uma data e hora específicas (por exemplo, na segunda frase, não é dito que horas o filme começou; na verdade nem diz se ele foi exibido de fato, só se sabe quanto tempo ele dura).

O que confunde é que ambos usam os mesmos termos (anos, meses, dias, horas, minutos e segundos), e até mesmo a representação pode ser igual: um relógio mostra `10:00:00` para indicar que são 10 horas da manhã, um cronômetro mostra `10:00:00` para mostrar que já se passaram 10 horas.

Outro detalhe é que esses conceitos, embora não sejam a mesma coisa, estão relacionados: se eu tenho uma data e somo uma duração, o resultado é outra data (ex: dia 10 de janeiro somado com uma duração de 3 dias resulta em 13 de janeiro), e se eu calculo a diferença entre duas datas, o resultado é uma duração (entre 10 e 13 de janeiro, a duração é de 3 dias).

E como são coisas diferentes, tratar um como se fosse o outro nem sempre trará os resultados esperados. Junte a isso o suporte nem sempre adequado das linguagens, e temos códigos confusos que muitas vezes só funcionam por coincidência (quando funcionam).

---

Um exemplo comum é, dada uma tabela com horários de entrada e saída de um funcionário, calcular quantas horas foram trabalhadas no total.

| Entrada | Saída |
|---------|-------|
| 08:00   | 17:00 |
| 08:15   | 18:30 |
| 09:30   | 18:30 |
| etc     | ...   |

Os dados da tabela são horários (momentos específicos do dia), mas eu quero calcular a duração (o total de horas). Um erro comum é pegar a diferença entre a entrada e saída, e tratá-la como um horário. Por exemplo, na primeira linha, o total de horas é 9 (foram trabalhadas 9 horas naquele dia), mas o programador guarda essa informação como se fosse um horário (`09:00` - que na verdade é 9 da manhã, e não uma duração de 9 horas). Já na segunda linha, a duração é de 10 horas e 15 minutos, e na terceira, de 9 horas.

Se eu guardar esses valores como horários (usando algum tipo específico, caso a linguagem suporte), geralmente não vai ser possível obter o total (que é de 28 horas e 15 minutos), já que os tipos de data/hora não permitem valores acima de 24 para as horas - e nem vou entrar no mérito de que "somar horas" é uma operação que sequer faz sentido: quanto é "9 da manhã" mais "10 e 15 da manhã"?

Agora se eu tratar esses valores como durações, aí sim faz sentido: uma duração de 9 horas mais outra duração de 10 horas e 15 minutos é igual a uma duração de 19 horas e 15 minutos. E não há o limite de 24 horas, como há para os horários. Para as linguagens que suportam um tipo específico para durações, isto é perfeitamente possível. Mas quando não há um tipo disponível, você pode criar o seu próprio, ou então trabalhar com um número mesmo (que guarda, por exemplo, o tempo total em minutos, ou segundos, ou qualquer unidade que você precisar).

O importante é não confundir os conceitos e não usar um quando na verdade se deve usar outro. Um erro **muito** comum é tentar usar uma data de qualquer maneira (com gambiarras que às vezes podem "funcionar", mas geralmente é por coincidência), quando uma duração seria bem mais apropriado e simples (e o mais importante, dando resultados corretos, sem depender de coincidências). É só ver o que aconteceu [aqui](https://pt.stackoverflow.com/a/370220/112052), por exemplo (apesar de todos os votos positivos, está completamente errado, e na [minha resposta](https://pt.stackoverflow.com/a/370227/112052) eu explico os motivos)[^rant].

  [^rant]: Acho até que os votos positivos sejam consequência de tanta gente não entender a diferença entre datas e durações, e por isso acham que aquele código está certo e faz sentido. Mas divago...

---

Vamos ver então como seria uma solução para este problema. Lembrando que **os códigos abaixo focam neste caso específico**, em que temos apenas o horário (horas e minutos). Se tivesse que calcular considerando os dias, meses e/ou anos, iria precisar de modificações e adaptações para cada caso. Mas o importante é ter em mente a ideia principal: nunca confundir datas/horas com durações, e nunca tratar um como se fosse o outro.

Abaixo tem soluções em algumas linguagens (você pode usar os links abaixo para ir direto para uma delas):

{% include languages.html languages="java,csharp,python,php,javascript" %}

### Java

Se você estiver usando o Java >= 8, use a [API `java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html). Para representar um horário (**somente** hora, minuto, segundo e frações de segundo), você pode usar a classe [`java.time.LocalTime`](https://docs.oracle.com/javase/8/docs/api/java/time/LocalTime.html). E para calcular a diferença, você pode usar um [`Duration`](https://docs.oracle.com/javase/8/docs/api/java/time/Duration.html), algo assim:

```java
LocalTime entrada = LocalTime.parse("08:00");
LocalTime saida = LocalTime.parse("17:00");
Duration duracao = Duration.between(entrada, saida);
```

Para calcular o total, você poderia usar um *loop*:

```java
Duration total = Duration.ZERO;
for (Horarios h: listaHorarios) {
    LocalTime entrada = LocalTime.parse(h.getHorarioEntrada());
    LocalTime saida = LocalTime.parse(h.getHorarioSaida());
    total = total.plus(Duration.between(entrada, saida)); // plus() retorna outro Duration com o resultado da soma
}
```

Já para obter o resultado, infelizmente não há uma forma "limpa" e direta de formatar a saída, e você terá que fazer manualmente. A partir do Java 9 você pode usar métodos como `toHoursPart()` e `toMinutesPart()`:

```java
long horas = total.toHoursPart();
long minutos = total.toMinutesPart();
```

Mas no Java 8, a conta tem que ser feita manualmente:

```java
long minutos = total.toMinutes();
long horas = minutos / 60;
minutos %= 60;
```

Isso porque `toMinutes()` retorna o total de minutos correspondente à duração (por exemplo, se a duração for de 28 horas e 15 minutos, `toMinutes()` retorna `1695`). Já `toMinutesPart()` retorna `15`.

Outra forma é usar um `java.time.temporal.ChronoUnit` e obter o total em minutos, por exemplo:

```java
long totalMinutos = 0;
for (Horarios h: listaHorarios) {
    LocalTime entrada = LocalTime.parse(h.getHorarioEntrada());
    LocalTime saida = LocalTime.parse(h.getHorarioSaida());
    totalMinutos += ChronoUnit.MINUTES.between(entrada, entrada);
}
// depois, "quebre" o valor
long horas = totalMinutos / 60;
long minutos = totalMinutos % 60;
```

Lembrando que neste caso específico eu só tenho as horas e minutos, por isso ter o total em minutos é adequado. Mas se tivesse também os segundos e/ou frações de segundos, aí você teria que considerá-los (e aí acho que usar um `Duration` simplifica as coisas, pois internamente ele já trata desses detalhes).

Para Java <= 7, não há uma classe específica para durações, e o único jeito é fazer o cálculo manualmente (similar o que foi feito abaixo com [PHP](#php), por exemplo).

### C#

Em C#, o horário pode ser representado por um [`DateTime`](https://docs.microsoft.com/en-us/dotnet/api/system.datetime?view=netframework-4.7.2), e uma duração, por um [`TimeSpan`](https://docs.microsoft.com/en-us/dotnet/api/system.timespan?view=net-5.0). A ideia geral é bem similar ao código anterior:

```c#
TimeSpan total = TimeSpan.Zero;
foreach (Horarios h in listaHorarios)
{
    if (DateTime.TryParseExact(h.HorarioEntrada, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var entrada)
        && DateTime.TryParseExact(h.HorarioSaida, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var saida))
    {
        total = total.Add(saida - entrada);
    }
}
```

Repare que um `DateTime` sobrecarrega a operação de subtração, por isso que `saida - entrada` já retorna um `TimeSpan` corretamente.


### Python

Em Python você pode usar o [módulo `datetime`](https://docs.python.org/3/library/datetime.html). Neste caso, temos que fazer o *parsing* de uma string, e para isso precisamos de [`strptime`](https://docs.python.org/3/library/datetime.html#datetime.datetime.strptime) (que retorna um [`datetime`](https://docs.python.org/3/library/datetime.html#datetime-objects)). Já para representar uma duração, basta usar um [`timedelta`](https://docs.python.org/3/library/datetime.html#timedelta-objects):

```python
from datetime import datetime, timedelta

horarios = [ ("08:00", "17:00"), ("08:15", "18:30"), ("09:30", "18:30") ]

total = timedelta(hours=0)
for ini, fim in horarios:
    entrada = datetime.strptime(ini, '%H:%M')
    saida = datetime.strptime(fim, '%H:%M')
    total += saida - entrada

segundos = int(total.total_seconds())
horas, segundos = divmod(segundos, 3600)
minutos, segundos = divmod(segundos, 60)
print(f'{horas:02}:{minutos:02}:{segundos:02}') # 28:15:00
```

Repare que podemos subtrair duas datas com o operador `-`, que o resultado é um `timedelta` (que por sua vez, pode ser somado diretamente a outro `timedelta`). Para obter o total, porém, temos que fazer manualmente, obtendo o total em segundos com `total_seconds()` (e neste caso eu converti para `int` porque sei que não há frações de segundo, mas caso tenha, este arredondamento não poderia ser feito).

### PHP

Em PHP acredito que o mais simples é converter cada horário em um "total de minutos" e calcular a diferença manualmente:

```php
function getTotalMinutes($hm) {
    list($hora, $minuto) = explode(':', $hm);
    return $hora * 60 + $minuto;
}

$horarios = [ ["08:00", "17:00"], ["08:15", "18:30"], ["09:30", "18:30"] ];
$totalMins = 0;
foreach($horarios as list($entrada, $saida)) {
    $totalMins += getTotalMinutes($saida) - getTotalMinutes($entrada);
}

$horas = $totalMins / 60;
$minutos = $totalMins % 60;
echo sprintf("%02d:%02d", $horas, $minutos); // 28:15
```

Claro que você até poderia usar [`DateTime`](https://www.php.net/manual/pt_BR/class.datetime.php) para as datas e [`DateInterval`](https://www.php.net/manual/pt_BR/dateinterval.construct.php) para as durações, porém não é possível somar um `DateInterval` com outro, o que torna o seu uso bem limitado para o nosso caso.

### JavaScript

Em JavaScript, até o presente momento, não existe uma classe específica para representar uma duração. Atualmente existe uma [proposta para a API `Temporal`](https://tc39.es/proposal-temporal/docs/index.html), que possuirá suporte a durações, mas ela ainda não é suportada por todos os *browsers*. Ou seja, por enquanto, o jeito é recorrer a bibliotecas externas, ou então fazer o cálculo manualmente, similar ao que foi feito acima:

```javascript
function getTotalMinutes(hm) {
    var [hora, minuto] = hm.split(':').map(v => parseInt(v));
    return hora * 60 + minuto;
}

var horarios = [ ["08:00", "17:00"], ["08:15", "18:30"], ["09:30", "18:30"] ];
var totalMins = 0;
for (var [ini, fim] of horarios) {
    totalMins += getTotalMinutes(fim) - getTotalMinutes(ini);
}
var horas = Math.floor(totalMins / 60);
var minutos = totalMins % 60;
console.log(`${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`); // 28:15
```

---

### Considerações finais

Use sempre o tipo mais adequado para cada situação. Nem sempre a linguagem que estamos usando possui suporte adequado à durações, mas sempre é possível criar um ou então usar um número mesmo (e aí ele pode representar o total em minutos, segundos, ou qualquer outra unidade que você precisar). Às vezes usar o tipo errado "funciona" por coincidência (como usar o `LocalTime` do Java para representar uma duração em horas, que "funciona" para durações de até 24 horas, mas ainda sim é um uso torto e sujeito a erros).

Mas programar baseado em coincidências não é o ideal. O melhor é tratar cada dado de acordo com o que ele representa, usando o tipo mais adequado e com a semântica correta. Se datas e durações são coisas diferentes, não trate-as como se fossem a mesma.
