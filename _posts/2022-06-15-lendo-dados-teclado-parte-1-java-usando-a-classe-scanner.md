---
layout: custompost
title: "Lendo dados do teclado - parte 1 (Java): usando a classe java.util.Scanner"
date: 2022-06-15 08:00:00 -0300
categories: java scanner IO
description: Problemas ao usar o Scanner? Você pede para ler os dados mas ele não lê corretamente? Entenda melhor como ela funciona e como evitar esses problemas.
show_desc: true
comments: true
---

Um problema muito frequente que vejo acontecer ao se usar a classe `java.util.Scanner` é quando tem algo assim:

```java
Scanner sc = new Scanner(System.in);
System.out.println("Digite sua idade:");
int idade = sc.nextInt();
System.out.println("Digite seu nome:");
String nome = sc.nextLine();
System.out.printf("Nome: %s, idade: %d\n", nome, idade);
```

Então quando o programa pede para digitar a idade, você digita `42` e dá <kbd>ENTER</kbd>. Mas aí o programa nem espera você digitar o nome, e já imprime:

```none
Nome: , idade: 42
```

Ou seja, o nome ficou vazio, e ele nem sequer deixou você digitá-lo.

---
## O que aconteceu?

Basicamente, quando você digita <kbd>ENTER</kbd>, o `System.in` recebe um [caractere de quebra de linha](https://www.fileformat.info/info/unicode/char/0a/index.htm) (o famoso `\n`, ou *line break*, ou *newline*, ou *line feed*). Só que este caractere nem sempre é consumido pelo `Scanner`.

A ideia é que cada método do `Scanner` só consuma o mínimo de caracteres necessários para retornar o valor que foi requisitado. No caso de `nextInt`, ele verifica que `4` e `2` são parte de um número, mas a quebra de linha não. Por isso ele só consome os caracteres `4` e `2`, retornando o número `42`. Mas a quebra de linha permanece lá, para ser consumida pelo próximo método do `Scanner`.

Depois, quando `nextLine` é chamado, ele consome tudo até a quebra de linha. E segundo a [documentação](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/Scanner.html#nextLine()), ele não inclui a quebra de linha no resultado ("*returns the rest of the current line, excluding any line separator at the end*"). Ou seja, ele vai lendo tudo até encontrar uma quebra de linha, e devolve tudo que foi lido (exceto a própria quebra de linha). Mas como neste caso o próximo caractere já era a própria quebra de linha, o resultado foi uma string vazia.

## Mas por que é assim?

Para ser mais exato, o `Scanner` quebra a entrada (no caso do `System.in`, os caracteres digitados) em ***tokens***, que são basicamente sequências de caracteres separadas por delimitadores. Por padrão um delimitador é qualquer caractere que retorne `true` para o [método `Character.isWhitespace`](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/lang/Character.html#isWhitespace(char)) (que no caso são espaços, quebras de linha, entre outros)[^delim].

  [^delim]: É possível mudar o delimitador, usando o método `useDelimiter`.

Ou seja, qualquer sequência de caracteres que não sejam espaços nem quebras de linha será considerada um *token*. E os métodos do `Scanner`, em geral, processam um *token* de cada vez. Mas há exceções, como `nextLine()`, que lê tudo até o final da linha, ou `findInLine`, que ignora os delimitadores, entre outros - e a melhor forma de saber se um método considera ou não os *tokens* é **lendo a [documentação](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/Scanner.html)**.

No caso de `nextInt()`, a [documentação](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/Scanner.html#nextInt()) diz: "*Scans the **next token** of the input as an int*". Ou seja, ele vai pegar o próximo *token* e converter para um número inteiro. Por exemplo, suponha que eu tenho um código que chama `nextInt()` três vezes seguidas:

```java
Scanner sc = new Scanner(System.in)
int a = sc.nextInt();
int b = sc.nextInt();
int c = sc.nextInt();
```

Se eu digitar `10 20 30` (assim mesmo, tudo na mesma linha) e em seguida <kbd>ENTER</kbd>, ele vai ler os números `10`, `20` e `30` separadamente, mesmo que todos estejam na mesma linha (e os valores de `a`, `b` e `c` serão respectivamente 10, 20 e 30). Afinal, o espaço é um caractere delimitador, então há três _tokens_ (`10`, `20` e `30`), e portanto três chamadas seguidas de `nextInt()` retornarão os respectivos números.

E se eu digitar `10`, <kbd>ENTER</kbd>, `20`, <kbd>ENTER</kbd>, `30`, <kbd>ENTER</kbd>, também serão três *tokens* (pois o <kbd>ENTER</kbd> gera o caractere de quebra de linha, que é um delimitador), e os valores de `a`, `b` e `c` também serão 10, 20 e 30. Vale notar que em ambos os casos os delimitadores (espaços e quebras de linha) **não** fazem parte dos *tokens*. Por isso que no primeiro exemplo acima a quebra de linha não é consumida.

Ao usar `nextInt()`, estou basicamente dizendo "_me dê o próximo número_", sem me importar se ele está na mesma linha, na próxima, depois de 20000 espaços, etc. O que importa é que o próximo *token* possa ser convertido para número.

O problema acontece quando você mistura métodos que pegam o próximo *token* (ou seja, que levam em conta os delimitadores) com métodos que não trabalham com *tokens* (como `nextLine()`, que sempre lê tudo até o final da linha, independente de quais sejam os delimitadores).

Então você precisa saber exatamente o que quer fazer. Você quer um número, independente de ter mais informações na mesma linha, ou quer que a linha toda contenha apenas um número e nada mais? Se for o segundo caso, então não use `nextInt()`, prefira ler a linha toda com `nextLine()` e em seguida converta-a para `int`. Poderia ter um método que faz essa validação, por exemplo:

```java
public static int lerInt(String mensagem, Scanner sc) {
    while (true) {
        try {
            System.out.println(mensagem);
            return Integer.parseInt(sc.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Você não digitou um número");
        }
    }
}
```

Assim, ele pede que o número seja digitado, e enquanto não digitar corretamente, ele mostra a mensagem de erro e pede para digitar novamente. Para usar seria algo como:

```java
Scanner sc = new Scanner(System.in);
int idade = lerInt("Digite sua idade:", sc);
System.out.println("Digite seu nome:");
// para ler String, continue usando nextLine()
String nome = sc.nextLine();
System.out.printf("Nome: %s, idade: %d\n", nome, idade);
```

Desta forma, não ocorre o problema da quebra de linha não ser consumida, já que `nextLine()` pegará a linha toda, e depois `Integer.parseInt` tentará converter para `int`.

Uma alternativa que muitos sugerem é chamar `nextLine()` logo depois de `nextInt()`, para garantir que a quebra de linha seja consumida:

```java
int idade = sc.nextInt();
sc.nextLine();
```

Mas já que é para consumir toda a linha, por que não usar `nextLine()` de uma vez?

**Lembrando ainda que há uma diferença**: suponha que foi digitado, por exemplo, `42 abc` e <kbd>ENTER</kbd>. Se eu usar o método `lerInt`, então `Integer.parseInt(sc.nextLine())` vai ler a linha inteira (`42 abc`) e tentar converter tudo isso para número, e não será possível (portanto mostrará a mensagem de erro e pedirá que digite novamente). Mas se eu usar `nextInt()`, ele vai ler o `42` e converter corretamente para `int`, e em seguida o `nextLine()` irá ler o restante da linha (` abc` - e repare que o espaço antes do "a" também faz parte da string). Isso pode fazer diferença dependendo do que você precisa.

Por exemplo, se a sua intenção é que toda a linha contenha apenas o número e nada mais, então o método `lerInt` é o mais adequado. Mas se quer que o próximo *token* seja um número, e depois quer ignorar o restante da linha, usar `nextInt()` seguido de `nextLine()` seria melhor.

> **Atenção**: dependendo do caso, `sc.nextInt()` não é 100% equivalente a `Integer.parseInt(sc.nextLine())`. Veja mais abaixo na [seção "_`Integer.parseInt` vs `nextInt()`_"](#integerparseint-vs-nextint).

---

## Mas e o método hasNextInt()?

Dependendo de como você fizer, pode não funcionar da forma esperada no caso de alguém digitar algo que não é um número (por exemplo, `xyz`), porque [segundo a documentação](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/Scanner.html#hasNextInt()), **os caracteres digitados não são consumidos** por este método ("*The scanner does not advance past any input*").

Ou seja, se o código fosse assim:

```java
// ERRADO, se não digitar um número válido (por exemplo, "xyz"), ele entra em loop
public static int lerInt(String mensagem, Scanner sc) {
    while (true) {
        System.out.println(mensagem);
        if (sc.hasNextInt()) {
            return sc.nextInt();
        } else {
            System.out.println("Você não digitou um número");
        }
    }
}
```

O que acontece se digitar `xyz`? O método `hasNextInt()` detecta que o próximo *token* não é um número e cai no `else`, mostrando a mensagem de erro ("_Você não digitou um número_"). Depois o `while` continua, mas como os caracteres não são consumidos pelo `Scanner`, a próxima chamada de `hasNextInt()` ainda estará olhando para `xyz`, então vai continuar dando `false`, e o código entra em *loop* (com o detalhe que o programa nem sequer espera você digitar algo, ele simplesmente imprime a mensagem e já chama `hasNextInt()` novamente).

Claro que seria possível usar a outra ideia mencionada acima (colocar um `nextLine()` ou `next()` dentro do `else`, para forçar que a linha ou o *token* seja consumido), mas deve-se levar em conta as diferenças já explicadas.

---

## Não vale somente para `int` (ou: A diferença entre `next()` e `nextLine()`)

Tudo que foi dito acima sobre `nextInt()` também vale para os demais métodos que trabalham com *tokens*, como `nextDouble()`, `nextLong()`, etc. Ou seja, se você digitar a informação que o método espera (por exemplo, um número no formato correto), a quebra de linha não é consumida.

A mesma atenção deve ser tomada ao usar o método `next()`, que você pode pensar como sendo um "nextString", já que ele retorna o próximo *token* como uma `String`. E como este método trabalha com *tokens*, ele também pode gerar comportamentos inesperados. Por exemplo, se tivermos este código:

```java
Scanner sc = new Scanner(System.in);
System.out.println("Digite seu nome:");
String nome = sc.next();
System.out.println("Digite seu endereço:");
String endereco = sc.next();
System.out.printf("Nome: %s, endereço: %s\n", nome, endereco);
```

Se ao pedir o nome eu digitar `Fulano de Tal` e <kbd>ENTER</kbd>, ele nem espera eu digitar o endereço, e já imprime:

```none
Nome: Fulano, endereço: de
```

Isso acontece porque `next()` pega o próximo *token*, e como já dito, por padrão o `Scanner` usa espaços e quebras de linha como delimitadores. Por isso, em `Fulano de Tal` temos três *tokens* ("Fulano", "de" e "Tal"), e a primeira chamada de `next()` pega somente o primeiro *token*, que é "Fulano". Na segunda vez que `next()` é chamado, ele pega o segundo *token* (que é "de"), por isso ele nem espera você digitar nada, porque não precisa (ele verifica que já existe um *token* disponível e o retorna).

Novamente, você precisa saber o que exatamente quer fazer: você quer o próximo *token* ou tudo que estiver na linha? Se for a segunda opção, use `nextLine()`.

---

### E se eu mudar o delimitador?

É possível mudar o delimitador, usando o [método `useDelimiter`](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/Scanner.html#useDelimiter(java.lang.String)). Por exemplo, você pode definir que apenas a quebra de linha separa os *tokens*, mas o espaço não:


```java
// apenas a quebra de linha é o delimitador
Scanner sc = new Scanner(System.in).useDelimiter("\n");
System.out.println("Digite seu nome:");
String nome = sc.next(); // assim, posso usar next() mesmo se eu digitar espaços
System.out.println("Digite seu endereço:");
String endereco = sc.next();
System.out.printf("Nome: %s, endereço: %s\n", nome, endereco);
```

Assim, somente a quebra de linha irá separar os *tokens*, e `next()` lerá a linha inteira quando você digitar algo que tenha espaços.


---

## `Integer.parseInt` vs `nextInt()`

Apesar de eu ter dito acima que `Integer.parseInt(sc.nextLine())` é uma alternativa para `sc.nextInt()`, temos que lembrar de alguns detalhes importantes.

Quando você cria um `Scanner`, por padrão ele usa o *locale default* retornado por `Locale.getDefault(Locale.Category.FORMAT)`. De forma **bem** resumida, um `Locale` define várias configurações relativas a um idioma, como o formato de números ("mil e duzentos" pode ser escrito como `1.200` no Brasil ou `1,200` nos EUA, por exemplo), entre várias outras coisas (como sempre, [leia a documentação para mais detalhes](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/util/Locale.html)).

E o *locale* interfere diretamente na forma como o `Scanner` reconhece números. Por exemplo, na minha máquina o *locale default* é `pt_BR` (código para o português do Brasil), que usa o ponto como separador de milhares. Se eu digitar `+1.234`, então `Integer.parseInt(sc.nextLine())` dará erro, já que este método não aceita os separadores no número. Já `nextInt()` retornará o número `1234` (mil duzentos e trinta e quatro).

Mas se eu mudar o *locale* (por exemplo, `Scanner sc = new Scanner(System.in).useLocale(Locale.US)` para usar o *locale* correspondente ao inglês americano), agora `+1.234` dá erro, pois neste *locale* o separador de milhares é a vírgula - então o `Scanner` só reconhece o número se eu digitar `+1,234`.

O mesmo vale para o separador decimal quando eu uso `nextDouble()`: em alguns *locales* (como o português) usa-se a vírgula, enquanto em outros (como o inglês), usa-se o ponto. Ou seja, dependendo do *locale*, o número "um e meio" deve ser digitado como `1,5` ou `1.5`, para que `nextDouble()` o reconheça corretamente.

Isso faz com que o `Scanner` seja mais flexível e poderoso (já que `Integer.parseInt` e `Double.parseDouble` não aceitam separadores de milhares, além de não ser possível configurá-los para *locales* diferentes), mas ainda sim é preciso se atentar a tudo que já foi dito: o fato desses métodos trabalharem com *tokens*, e os problemas que isso causa ao misturá-los com métodos que ignoram os delimitadores, como `nextLine()`. Não existe solução universal, e tudo depende do que você precisa fazer: você quer que toda a linha tenha apenas o número e nada mais, ou quer que o próximo *token* seja um número, independente de estar ou não na mesma linha?

Por fim, uma alternativa seria usar `nextLine()` juntamente com [`DecimalFormat`](https://docs.oracle.com/en/java/javase/18/docs/api/java.base/java/text/DecimalFormat.html), pois com esta classe é possível configurar o *locale*, os separadores de milhares e casas decimais, etc.

---

## Conclusão

Como tudo em programação, não existe _A Solução Ideal Para Todos Os Casos_<sup>®</sup>, pois tudo depende do que você quer fazer. Se quer que a linha toda contenha apenas uma informação específica (como por exemplo, um número inteiro), então prefira ler a linha toda com `nextLine()` e depois processá-la de acordo (convertendo-a para número, ou fazendo qualquer outra validação, etc). Mas se quer que o próximo *token* seja um número, independente de ter ou não mais informações na mesma linha, então use o respectivo método `nextAlgumaCoisa`.

E sempre veja na documentação se o método que você usou trabalha com *tokens* ou se ignora os delimitadores. E claro, teste bastante, até entender o que está acontecendo.