---
layout: custompost
title: "Entendendo o Date do JavaScript (ou: criei um Date mas ao printar/formatar ele fica com dia/hora errado)"
date: 2021-11-29 08:00:00 -0300
categories: data timestamp formatacao
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

Mas internamente o `Date` só tem o valor do timestamp, e se você leu [o respectivo post já indicado acima]({{ site.baseurl }}{% post_url 2019-05-02-o-que-e-timestamp %}){: class="new-window" }, já sabe que para uma data e hora ser convertida para um timestamp, você precisa de um timezone. E neste caso o JavaScript usará o timezone que estiver configurado no browser. No meu ambiente, o browser está usando o "Horário de Brasília", então **se o seu ambiente está com uma configuração de fuso horário diferente da minha, os resultados não necessariamente serão os mesmos**.

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

Sendo assim, se quiser um formato customizado, o jeito é usar os *getters* e construi-lo manualmente. Mas com isso você está limitado a usar o timezone do browser ou UTC, já que não há *getters* que obtém os valores de acordo com um timezone específico. Para formatar a data em um formato customizado (que não dependa do locale) **e** com os valores de data e hora referentes a um timezone que não seja o do browser e nem UTC, o jeito é recorrer a bibliotecas externas. Algumas opções são:

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

---

Para mais detalhes sobre `Date`, e para se aprofundar nos assuntos abordados neste post, leia [aqui](https://pt.stackoverflow.com/q/456089/112052), [aqui](https://pt.stackoverflow.com/q/455437/112052), [aqui](https://pt.stackoverflow.com/q/408160/112052), [aqui](https://pt.stackoverflow.com/a/416172/112052), [aqui](https://pt.stackoverflow.com/a/344030/112052), [aqui](https://pt.stackoverflow.com/q/498025/112052) e [aqui](https://pt.stackoverflow.com/a/494302/112052).
