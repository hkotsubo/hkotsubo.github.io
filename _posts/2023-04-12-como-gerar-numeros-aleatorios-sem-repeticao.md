---
layout: custompost
title: "Como gerar números aleatórios sem repetição"
date: 2023-04-12 08:00:00 -0300
categories: random
description: Não reinvente a roda, já existe algoritmo pronto - e provavelmente mais eficiente do que esse que você fez :-)
show_desc: true
comments: true
---

Vamos supor que preciso gerar um conjunto qualquer de números aleatórios, mas que não hajam valores repetidos. Por exemplo, para gerar um jogo da mega-sena (6 números distintos entre 1 e 60).

Uma ideia inicial - mas que tem seus problemas (já vamos entender melhor mais abaixo) - é ir guardando os números em uma lista/array, e para cada número gerado, verificar se ele já está na lista. Em JavaScript seria assim:

```javascript
const quantidade = 6, minimo = 1, maximo = 60;
const numeros = [];
while (numeros.length < 6) { // enquanto não tem 6 números
    const n = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo; // gera número entre 1 e 60
    if (!numeros.includes(n)) { // se o número não está no array, adiciona
        numeros.push(n);
    }
}
console.log(numeros);
```

A princípio funciona, mas essa solução não escala tão bem se a quantidade de números gerados for muito próxima da quantidade total. Vamos alterar o código acima para mostrar quando um número repetido é gerado:

```javascript
while (numeros.length < quantidade) {
    const n = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
    if (!numeros.includes(n)) {
        numeros.push(n);
    } else console.log(`array com ${numeros.length} elementos, ${n} repetido`);
}
```

Quando a `quantidade` é `6`, não há tantas repetições (na maioria das vezes tem uma ou nenhuma). Mas se aumentarmos para `quantidade = 40`, por exemplo, aí já muda bastante:

```
array com 4 elementos, 8 repetido
array com 16 elementos, 32 repetido
array com 23 elementos, 1 repetido
array com 23 elementos, 31 repetido
array com 24 elementos, 44 repetido
array com 24 elementos, 50 repetido
array com 28 elementos, 30 repetido
array com 29 elementos, 30 repetido
array com 29 elementos, 15 repetido
array com 32 elementos, 15 repetido
array com 32 elementos, 4 repetido
array com 33 elementos, 8 repetido
array com 33 elementos, 21 repetido
array com 34 elementos, 24 repetido
array com 34 elementos, 39 repetido
array com 35 elementos, 47 repetido
array com 36 elementos, 4 repetido
array com 36 elementos, 12 repetido
array com 36 elementos, 3 repetido
array com 37 elementos, 8 repetido
array com 37 elementos, 49 repetido
array com 37 elementos, 43 repetido
array com 37 elementos, 53 repetido
array com 38 elementos, 28 repetido
array com 38 elementos, 58 repetido
array com 38 elementos, 35 repetido
array com 38 elementos, 3 repetido
array com 38 elementos, 8 repetido
array com 38 elementos, 34 repetido
array com 38 elementos, 6 repetido
array com 38 elementos, 53 repetido
array com 38 elementos, 12 repetido
array com 38 elementos, 15 repetido
```

No começo ainda não há tantas repetições, mas conforme o array cresce e o tamanho se aproxima da quantidade que queremos, a probabilidade de sortear um número já existente aumenta. Ou seja, o loop se repete várias e várias vezes até encontrar um número que ainda não foi gerado. E ainda vale lembrar que o método `includes` precisa percorrer todo o array até encontrar o elemento em questão, para saber se ele está no array. Ou seja, o array `numeros` é percorrido várias vezes durante este processo.

Fiz um teste rodando este algoritmo mil vezes e computando a quantidade de repetições, além do mínimo e máximo:

```javascript
const quantidade = 40, minimo = 1, maximo = 60;
let sum = 0, qtd = 1000, min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER;
for (let c = 0; c < qtd; c++) {
    const numeros = [];
    let rep = 0;
    while (numeros.length < quantidade) {
        const n = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
        if (!numeros.includes(n)) {
            numeros.push(n);
        } else rep++;
    }
    sum += rep;
    if (rep > max) max = rep;
    if (rep < min) min = rep;
}
console.log(sum / qtd, min, max);
```

Rodei este código várias vezes, e a média variou em torno de 25 repetições. O máximo variou entre 45 e 60, o mínimo entre 6 e 10. Ou seja, em todas as vezes, sempre teve números repetidos.

---

## A solução: Fisher-Yates

Originalmente, o [algoritmo Fisher-Yates](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) serve para embaralhar um array. Mas podemos adaptá-lo para o nosso problema: no caso da mega-sena (6 números entre 1 e 60), basta gerar um array com todos os 60 números, embaralhá-lo e pegar os 6 primeiros. Porém, não precisamos embaralhar tudo, apenas as 6 primeiras posições:

```javascript
const quantidade = 6, minimo = 1, maximo = 60;
const todos = [];
for (let i = minimo; i <= maximo; i++) { // gera um array com todos os números
    todos.push(i);
}
// embaralha as 6 primeiras posições
for (let i = 0; i < quantidade; i++) {
    // pega uma posição aleatória do array e troca com a posição atual
    const j = Math.floor(Math.random() * todos.length);
    const tmp = todos[j];
    todos[j] = todos[i];
    todos[i] = tmp;
}
// pega os 6 primeiros elementos
const result = todos.slice(0, quantidade);
```

Este algoritmo evita tanto as repetições quanto a necessidade de verificar se o número gerado está no array, tornando-se muito mais eficiente.

**É claro** que para poucos arrays pequenos, a diferença será insignificante. Afinal, [para poucos dados, tudo é rápido](https://blog.codinghorror.com/everything-is-fast-for-small-n/). Mas se tiver que gerar muitos números várias vezes, começa a fazer diferença.

Fiz um teste usando o [Benchmark.js](https://benchmarkjs.com/) para medir cada algoritmo. O código ficou assim:

```javascript
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const quantidade = 6, minimo = 1, maximo = 60;
// só precisa criar todos os números uma vez, pois nas vezes seguintes o array será sempre re-embaralhado
const todos = [];
for (let i = minimo; i <= maximo; i++) {
    todos.push(i);
}

suite
.add('loop', function () {
    const numeros = [];
    while (numeros.length < quantidade) {
        const n = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
        if (!numeros.includes(n)) {
            numeros.push(n);
        }
    }
})
.add('fisher yates', function () {
    for (let i = 0; i < quantidade; i++) {
        const j = Math.floor(Math.random() * todos.length);
        const tmp = todos[j];
        todos[j] = todos[i];
        todos[i] = tmp;
    }
    const result = todos.slice(0, quantidade);
})
.on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.on('cycle', function (event) {
    console.log(String(event.target));
})
.run({ 'async': true });
```

O resultado pode variar de máquina para outra, mas em geral o Fisher-Yates foi mais rápido:

```none
loop x 5,815,553 ops/sec ±1.96% (81 runs sampled)
fisher yates x 7,341,581 ops/sec ±3.01% (79 runs sampled)
Fastest is fisher yates
```

Os números acima são as operações por segundo (quanto mais, melhor - e note que estão em notação americana, com vírgulas separando os milhares). Ou seja, o loop conseguiu mais de 5 milhões de operações por segundo, enquanto o Fisher-Yates conseguiu mais de 7 milhões (cerca de 1,26 vezes mais operações).

Mudando para `quantidade = 40`, a diferença se torna ainda mais gritante:

```none
loop x 280,240 ops/sec ±1.14% (88 runs sampled)
fisher yates x 1,470,527 ops/sec ±1.79% (85 runs sampled)
Fastest is fisher yates
```

Agora o Fisher-Yates conseguiu cerca de 5,24 vezes mais operações por segundo. Isso porque, como já vimos, para quantidade igual a 40 o loop começa a ter muitas repetições, tendo que gerar outro número (e para cada número gerado, precisa percorrer o array novamente para verificar se ele já existe).

---

## Considerações Finais

Quando alguém te diz para estudar os fundamentos (algoritmos, estruturas de dados, etc), é disso que estamos falando. A maioria dos problemas comuns já foi resolvida, com soluções exaustivamente testadas - e comprovadas - no mundo real. Claro que como exercício (para fins puramente didáticos) é interessante você mesmo tentar resolver - e provavelmente a ideia inicial que muitos têm é usar a primeira solução indicada acima. Mas saiba que para muita coisa já existem um ou mais algoritmos prontos. A maioria, inclusive, foi criada há décadas e aperfeiçoada ao longo do tempo. Em código sério que vai para a produção, geralmente você não precisa reinventar a roda.

Aliás, em algumas linguagens já existem bibliotecas que te trazem isso pronto. Em Python, por exemplo, existe a [função `random.sample`](https://docs.python.org/3/library/random.html#random.sample):

```python
from random import sample

# números entre 1 e 60
todos = range(1, 61) # em um range o valor final não é incluso, por isso é 61
# pega 6 números, sem repetição
numeros = sample(todos, k=6)
print(numeros)
```

Por fim, este algoritmo não vale apenas para números, e sim para **qualquer array/lista/coleção de dados**. Podemos, por exemplo, ter um array contendo objetos. Como o Fisher-Yates está trabalhando com os índices e em nenhum momento é preciso comparar os elementos em si, para ele tanto faz o que são esses elementos.
