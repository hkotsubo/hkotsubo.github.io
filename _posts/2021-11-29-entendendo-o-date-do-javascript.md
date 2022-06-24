---
layout: custompost
title: "Entendendo o Date do JavaScript (ou: criei um Date mas ao printar/formatar ele fica com dia/hora errado)"
date: 2021-11-29 08:00:00 -0300
categories: data timestamp formatacao javascript
description: Quer formatar sua data para DD/MM/YYYY, YYYY-MM-DD, ou qualquer outro formato? Não deu certo porque o resultado ficou com "um dia a menos", "três horas a mais", ou com "fuso horário diferente"? Veja aqui todos os detalhes e "pegadinhas", e possíveis soluções - e o mais importante, entenda porque isso acontece.
show_desc: true
comments: true
---

Eu poderia simplesmente jogar um monte de código e pronto (os famosos posts "Tente isso", que só deixam código e não explicam nada), mas acho que é muito mais importante que você entenda como funciona o [`Date` do JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), para só depois entender os problemas mais comuns que acontecem ao usá-lo e formatá-lo.

# O que é o `Date` do JavaScript

Apesar do nome, o `Date` não é exatamente uma data. Pelo menos não no sentido de ter um único valor de dia, mês, ano, hora, minuto e segundo.

Segundo a [especificação da linguagem](https://tc39.es/ecma262/#sec-date-objects), o único valor que um `Date` tem é a quantidade de milissegundos que se passaram desde `1970-01-01T00:00Z` (1 de janeiro de 1970, à meia-noite, em [UTC](https://en.wikipedia.org/wiki/UTC)). Esse valor também é chamado de timestamp, e já foi explicado em detalhes [em outro post]({{ site.baseurl }}{% post_url 2019-05-02-o-que-e-timestamp %}){: class="new-window" } (leitura sugerida para entender melhor).

Mas apenas para dar um exemplo: eu rodei `new Date().valueOf()` agora há pouco e o resultado foi o timestamp `1638186750973`. Esse valor é o mesmo no mundo todo (qualquer um que tivesse rodado o mesmo código no mesmo instante teria o mesmo valor). Só que este timestamp corresponde às seguintes datas e horas:

| Data e hora                  |  Fuso horário
|------------------------------|----------------
| 29/11/2021, às 08:52:30      | São Paulo
| 29/11/2021, às 03:52:30      | Los Angeles
| **30**/11/2021, às 01:52:30  | Samoa
| 29/11/2021, às 11:52:30      | UTC

Todas as datas e horas acima correspondem ao mesmo timestamp (`1638186750973`): o instante (o ponto na linha do tempo) é o mesmo, o que muda é a data/hora correspondente, que varia conforme o timezone (fuso horário). Em cada parte do mundo, o mesmo timestamp corresponderá a uma data e/ou hora diferente, e esse ponto é crucial para entendermos os problemas que ocorrem ao manipular e formatar datas no JavaScript.

## Obtendo os campos da data

Quando você usa métodos como `getDate()` ou `getHours()`, os valores retornados levam em conta o **timezone que está configurando no ambiente no qual o código roda** (seja o browser, o Node.js, [Deno](https://deno.land/), etc). O mesmo acontece se você imprime a data (com `console.log` ou `alert`, por exemplo) ou usa métodos como `toString()` ou `toLocaleString()`. Os valores de data e hora sempre estarão no timezone que estiver configurado no browser (*a partir de agora vou dizer apenas "browser", mas entenda que estou me referindo ao ambiente no qual o código roda, podendo ser também o Node.js, [Deno](https://deno.land/), ou qualquer outro runtime*).

Porém, existem métodos que retornam os valores em UTC. Alguns são mais óbvios, como `getUTCDate()` e `getUTCHours()`, mas outros nem tanto, como `toISOString()` por exemplo. E é a partir daí que surgem os clássicos problemas de "_criei uma data mas ela fica com um dia a menos_". Exemplo:

```javascript
// Atenção! Os resultados abaixo foram obtidos em um browser configurado
// com o timezone "Horário de Brasília"

// 29 de novembro de 2021, às 23:30
// Sim, novembro é 10 (porque janeiro é 0, fevereiro é 1, etc)
let data = new Date(2021, 10, 29, 23, 30);

console.log(data.toLocaleString('pt-BR')); // 29/11/2021 23:30:00
console.log(data.toISOString());           // 2021-11-30T02:30:00.000Z
```

Primeiro eu crio uma data referente a 29 de novembro de 2021, às 23:30 (lembrando do *irritante* detalhe de que [no `Date` do JavaScript, janeiro é zero](https://pt.stackoverflow.com/a/405998/112052), por isso que novembro é `10`).

Mas internamente o `Date` só tem o valor do timestamp, e se você leu [o respectivo post já indicado acima]({{ site.baseurl }}{% post_url 2019-05-02-o-que-e-timestamp %}){: class="new-window" }, já sabe que para uma data e hora ser convertida para um timestamp, você precisa de um timezone. E neste caso o JavaScript usará o timezone que estiver configurado no browser. No meu ambiente, o browser está usando o "Horário de Brasília" (geralmente o browser usa o que está configurado no Sistema Operacional), então **se o seu ambiente está com uma configuração de fuso horário diferente da minha, os resultados não necessariamente serão os mesmos**.

Enfim, a data criada acima refere-se a 29 de novembro de 2021, às 23:30 no Horário de Brasília (pois este é o timezone configurado no meu browser). Ao imprimir a data com `toLocaleString()`, os valores de data e hora seguem o timezone do browser. Mas `toISOString()` retorna os valores em UTC (repare como o dia e a hora mudaram).

É daí que surgem aqueles problemas de "*criei uma data mas ela aparece com um dia/algumas horas a mais (ou a menos)*". Graças à forma como o `Date` funciona (somado ao fato de alguns métodos usarem UTC e outros não), esse tipo de problema infelizmente ainda é muito comum.

# Tá, e como eu resolvo?

Depende do que você quer fazer.

Se quer que os valores de data e hora sigam o timezone do browser, use os métodos que retornam tais valores (como os *getters* e `toLocaleString`). Se quer os valores em UTC, use os métodos `getUTCXXX` e `toISOString`.

Se quer os valores em outro timezone, uma alternativa é passá-lo para `toLocaleString`. Exemplo:

```javascript
// criar Date correspondente ao timestamp 1638186750973
const d = new Date(1638186750973);
// formatar usando timezones diferentes
for (const tz of ['America/Sao_Paulo', 'America/Los_Angeles', 'Pacific/Apia', 'UTC']) {
    console.log(d.toLocaleString('pt-BR', { timeZone: tz }));
}
```

O primeiro parâmetro é o *locale*, que é explicado em mais detalhes na [documentação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation). No exemplo acima, usei `pt-BR`, que corresponde ao português do Brasil (ou seja, o formato da data - no caso, "dd/mm/aaaa hh:mm:ss" - usa a configuração deste idioma), e eu imprimo a mesma data usando timezones diferentes. A saída é:

```none
29/11/2021 08:52:30
29/11/2021 03:52:30
30/11/2021 01:52:30
29/11/2021 11:52:30
```

Repare que o **formato** é o mesmo ("dd/mm/aaaa hh:mm:ss" - pois é o que está configurado para o locale pt-BR), mas os valores de data e hora podem variar de acordo com o timezone.

### E se eu quiser outro formato?

Infelizmente o JavaScript não nos dá muita alternativa. O máximo que dá para fazer é mudar o locale passado para `toLocaleString`, mas ainda sim você está limitado aos formatos que já estão configurados para cada um (sem contar que o sistema pode não ter determinado(s) locale(s) instalado(s) - por exemplo, o [Node, antes da versão 13 não vinha com os locales instalados](https://github.com/nodejs/node/issues/8500#issuecomment-556520467)). Há ainda a - um pouco mais rara, mas ainda sim possível - possibilidade do formato associado a um locale mudar. Por fim, há também o fato de [o formato retornado por `toLocaleString` não ser garantidamente o mesmo em todos os browsers](https://stackoverflow.com/q/25574963).

Sendo assim, se quiser um formato customizado, o jeito é usar os *getters* e construí-lo manualmente. Mas com isso você está limitado a usar o timezone do browser ou UTC, já que não há *getters* que obtém os valores de acordo com um timezone específico. Para formatar a data em um formato customizado (que não dependa do locale) **e** com os valores de data e hora referentes a um timezone que não seja o do browser e nem UTC, o jeito é recorrer a bibliotecas externas. Algumas opções são:

- [Moment.js](https://momentjs.com/) (neste caso precisa também do [Moment Timezone](https://momentjs.com/timezone/))
- [date-fns](https://date-fns.org/)
- [Luxon](https://moment.github.io/luxon/#/)

### Gambiarra

Se pesquisar um pouco, provavelmente você vai encontrar alguém sugerindo para mudar o valor do timestamp. Algo do tipo:

```javascript
// GAMBIARRA, NÃO FAÇA ISSO!
let data = new Date(); // data atual
// subtrai a diferença em relação a UTC
let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
console.log(data2.toISOString());
```

Como `toISOString()` retorna os valores de data e hora em UTC, então a ideia da "solução" acima é ajustar o timestamp, subtraindo a diferença em relação a UTC (que é o retorno de `getTimezoneOffset()`). Apesar de "funcionar" (mostra o valor "correto"), mudar o timestamp tem um problema, pois na verdade você está mudando o instante que a data representa.

Fazendo uma analogia, suponha que estou em São Paulo, e hoje é dia 29 de novembro de 2021, às 13:00. Neste mesmo instante, em Londres, já são 16:00. Mas vamos supor que meu computador está configurado com o fuso de Londres, e portanto ele mostra "16:00", mas eu gostaria que ele mostrasse o Horário de Brasília. Eu posso arrumar isso de duas maneiras:

1. mudando a configuração de fuso horário do computador, setando para o Horário de Brasília
2. mantendo a configuração de fuso horário, e atrasando o relógio em 3 horas

Em ambos os casos, vai passar a mostrar o horário correto (13:00). Mas a segunda opção, apesar de "funcionar", não está exatamente correta, pois na verdade o que eu fiz foi mudar o relógio para um instante diferente (13:00 em Londres, um instante que ocorreu três horas no passado). É isso que acontece quando você muda o timestamp, como no código-gambiarra acima: a data passa a corresponder a um instante completamente diferente (e se em algum lugar você estava contando que ela tivesse "a data atual", bem, boa sorte tentando achar este bug).

Sem contar que as regras dos timezones [mudam o tempo todo](https://www.timeanddate.com/news/time/): países vivem adotando e cancelando o horário de verão (só para ficar no exemplo mais comum), e por isso não dá para contar que as diferenças com relação a UTC sempre serão fixas. Por isso qualquer código que mude o valor para uma quantidade arbitrária de horas está sujeito a falhar mais cedo ou mais tarde (a opção 2 acima, por exemplo, falha quando um dos países está em horário de verão). Somente mantendo o sistema atualizado (e sem gambiarras como o código acima) você garante que não será pego de surpresa.

# Criando uma data específica

Outros problemas similares ocorrem quando se quer criar uma data específica, ou quando você recebe uma string e quer convertê-la para data.

Um exempo clássico (outro caso de "*criei uma data mas ela fica com um dia a menos*"):

```javascript
// código rodando em um browser configurado com o Horário de Brasília
// configurações diferentes não necessariamente darão o mesmo resultado

// 29 de novembro de 2021
let data = new Date('2021-11-29');
console.log(data.toLocaleDateString('pt-BR')); // 28/11/2021
```

Repare que quando você cria uma data com uma string, não tem mais aquela regra *irritante* de janeiro ser zero, fevereiro ser 1, etc. Aqui usa-se os valores corretos (por isso novembro é `11`). Mas ao imprimir a data, ela ficou com "um dia a menos" (repare que o dia é 28, e não 29).

Isso acontece porque, segundo a [documentação](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Timestamp_string), quando passamos uma string no formato "AAAA-MM-DD" (sem as horas), a data é tratada como UTC. Além disso, [também é dito](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Individual_date_and_time_component_values) que se os campos de horário forem omitidos, seus valores são setados para zero.

Ou seja, `new Date('2021-11-29')` cria uma data referente à 29 de novembro de 2021, **à meia-noite em UTC**. Mas `toLocaleDateString` retorna a data no timezone do browser, e no caso o meu está configurado com o Horário de Brasília. E como "meia-noite em UTC" corresponde à 21:00 do dia anterior no Horário de Brasília (ou 22:00 quando está em horário de verão), dá essa diferença de "um dia". Na verdade, se imprimirmos o horário dá para ver melhor o que aconteceu:

```javascript
// código rodando em um browser configurado com o Horário de Brasília
// configurações diferentes não necessariamente darão o mesmo resultado

// 29 de novembro de 2021
let data = new Date('2021-11-29');
console.log(data.toLocaleString('pt-BR')); // 28/11/2021 21:00:00
```

Uma solução é passar os campos de horário, pois assim ele passa a considerar o timezone do browser:

```javascript
let data = new Date('2021-11-29T00:00');
console.log(data.toLocaleString('pt-BR')); // 29/11/2021 00:00:00
```

Sim, o simples fato de adicionar o horário faz com que a data e hora não use mais UTC, e passe a usar o timezone do browser. Não vou entrar no mérito de discutir se isso é "bom" ou se "faz sentido", só vou repetir o que um professor de inglês que tive costumava dizer: "_Eu não inventei as regras, eu só as ensino_".

Por fim, se você usar os valores numéricos, sempre é usado o timezone do browser, mesmo que você não passe os campos de horário (e claro, tem o detalhe de ter que subtrair 1 do mês):

```javascript
// 29 de novembro (que tem que ser 10, não 11) de 2021
// horário omitido, então ele usa "meia-noite no timezone do browser"
let data = new Date(2021, 10, 29);
console.log(data.toLocaleString('pt-BR')); // 29/11/2021 00:00:00
```

Resumindo:

| Argumentos passados ao construtor | Sem horário         | Com horário         |
|:----------------------------------|:--------------------|:--------------------|
| string                            | UTC                 | timezone do browser |
| valores numéricos                 | timezone do browser | timezone do browser |


### Não use qualquer formato de string

Ao se passar uma string para o construtor de `Date`, o **único** formato [garantido pela especificação da linguagem](https://262.ecma-international.org/5.1/#sec-15.9.1.15) que funciona em qualquer ambiente é o definido pela [norma ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). No caso, é o que foi usado nos exemplos acima: "AAAA-MM-DD" ou "AAAA-MM-DDTHH:MM" (sim, tem uma letra "T" maiúscula entre a data e a hora). **Qualquer outro formato é dependente de implementação e não é garantido que funcione em todos os ambientes**.

> "_Ah, mas eu sempre usei o formato XYZ e funcionou_"

[Parabéns!](https://blog.codinghorror.com/the-works-on-my-machine-certification-program/) 🙂

Tudo bem que muitos formatos "funcionam" em vários browsers diferentes, mas se não quer depender da sorte, eu sugiro que qualquer string que você receber seja devidamente quebrada em valores numéricos ou convertida para ISO 8601, e só depois passe esses valores para o construtor.

Por exemplo, testando o formato "dd/mm/aaaa" no Node e Chrome:

```javascript
// 11 de setembro (e não 9 de novembro)
console.log(new Date('09/11/2021').toLocaleString('pt-BR')); // 11/09/2021 00:00:00

console.log(new Date('29/11/2021').toLocaleString('pt-BR')); // Invalid Date
```

Este formato é interpretado como "mês/dia/ano", e por isso o segundo caso sequer resulta em uma data válida (pode ser que funcione em algum outro browser, mas não tenho certeza). Neste caso, temos que tratar a string manualmente para extrair os valores corretos dela. E aí surgem códigos "bonitos" como esse:

```javascript
// obter os valores numéricos da string
let [dia, mes, ano] = '29/11/2021'.split('/').map(n => parseInt(n));
let data = new Date(ano, mes - 1, dia); // lembrar de subtrair 1 do mês
console.log(data.toLocaleString('pt-BR')); // 29/11/2021 00:00:00
```

Outra opção é usar alguma biblioteca externa, como já sugerido acima, que possuem opções de *parsing* mais flexíveis, na qual é possível indicar o formato. Por exemplo, no Moment.js seria algo como:

```javascript
// 29 de novembro de 2021, à meia-noite no timezone do browser
let data = moment('29/11/2021', 'DD/MM/YYYY');
// se quiser converter para Date
let jsDate = date.toDate();
```

E todas as libs já mencionadas possuem formas parecidas de obter a data a partir de uma string, bastando especificar o formato correto.

---

Para mais detalhes sobre `Date`, e para se aprofundar nos assuntos abordados neste post, leia [aqui](https://pt.stackoverflow.com/q/456089/112052), [aqui](https://pt.stackoverflow.com/q/455437/112052), [aqui](https://pt.stackoverflow.com/q/408160/112052), [aqui](https://pt.stackoverflow.com/a/416172/112052), [aqui](https://pt.stackoverflow.com/a/344030/112052), [aqui](https://pt.stackoverflow.com/q/498025/112052) e [aqui](https://pt.stackoverflow.com/a/494302/112052).
