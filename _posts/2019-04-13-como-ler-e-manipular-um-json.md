---
layout: custompost
title: "Como ler e manipular um JSON"
date: 2019-04-13 15:07:00 -0300
description: Aprenda de uma vez por todas a mexer com esse tal de JSON.
show_desc: true
categories: json
comments: true
---

JSON significa "JavaScript Object Notation" (Notação de Objetos JavaScript). Apesar de ter "JavaScript" no nome, ele pode ser usado em outras linguagens, pois o JSON é na verdade um [**formato** para representar dados](http://json.org/). A sua sintaxe foi inspirada no JavaScript - daí o nome - mas hoje em dia várias linguagens possuem algum suporte para ele, seja nativo ou via bibliotecas.

Dentro de um JSON podemos ter vários tipos de dados diferentes. Para começar, temos os tipos "básicos":

- strings: quaisquer caracteres entre aspas duplas. Ex: `"sou uma string"`. Também são aceitas aquelas sequências de escape comuns em várias linguagens, como `\n` para representar a quebra de linha, `\t` para <kbd>TAB</kbd>, etc.
- números: pode ser um valor inteiro positivo (`42`), negativo (`-10`), com casas decimais (`12.34` - e repare que o ponto - e não a vírgula - é o separador das casas decimais) ou em notação científica (`2.53962e15`)
- valores *booleanos* (`true` e `false`) e o valor nulo (`null`)

Além destes, podemos ter também **arrays** e **objetos**.

### Array

Um array é uma lista ordenada de valores, dentro de colchetes (`[` e `]`) e separados por vírgulas. Exemplo:

```javascript
[ 1, "segundo elemento", 3.4 ]
```

Este array tem 3 elementos: o primeiro é o número `1`, o segundo é a string `"segundo elemento"` e o terceiro é o número `3.4`. Veja que ele começa com `[` e termina com `]`, e os elementos são separados por vírgulas, .

Um detalhe importante é que um array não precisa ter necessariamente todos os elementos do mesmo tipo[^array].

  [^array]: Se a linguagem que você está usando para ler o JSON não permite que existam elementos de tipos diferentes em um mesmo array, aí é outra história...

Além disso, em um array, a ordem é importante. Então `[ 1, "segundo elemento", 3.4 ]` **não** é o mesmo que `[ 1, 3.4, "segundo elemento" ]`.

### Objeto

Um objeto é um conjunto de pares "chave: valor", dentro de chaves (`{` e `}`) e separados por vírgulas. A chave sempre é uma string, e o valor pode ser qualquer tipo válido. Exemplo:

```javascript
{ "nome": "Fulano", "idade": 90 }
```

Este objeto possui duas chaves:

- `"nome"`, cujo valor é a string `"Fulano"`
- `"idade"`, cujo valor é o número `90`

Repare que ele começa com `{` e termina com `}`. Entre uma chave e seu respectivo valor, sempre tem o caractere `:`, e entre cada par "chave: valor" há uma vírgula.

Um detalhe importante é que em um objeto a ordem dos pares "chave: valor" **não importa**. Ou seja, `{ "nome": "Fulano", "idade": 90 }` e `{ "idade": 90, "nome": "Fulano" }` são exatamente o mesmo objeto.

---

Dentro de um array ou objeto, os valores podem ser qualquer um dos tipos acima. Ou seja, podemos ter não só os tipos básicos, mas também outros arrays e objetos. Então podemos ter coisas como:

```javascript
{
    "nome": "Fulano",
    "idade": 90,
    "filmes_preferidos": [ "Pulp Fiction", "Clube da Luta" ],
    "contatos": {
        "telefone": "(11) 91111-2222",
        "emails": [ "fulano@gmail.com", "fulano@yahoo.com" ]
    }
}
```

O JSON acima é um objeto, pois está delimitado por `{` e `}`. Dentro dele temos 4 chaves:

- `"nome"`, cujo valor é a string `"Fulano"`
- `"idade"`, cujo valor é o número `90`
- `"filmes_preferidos"`, cujo valor é um array (pois está delimitado por colchetes: `[` e `]`)
    - este array, por sua vez, possui dois elementos: as strings `"Pulp Fiction"` e `"Clube da Luta"`
- `"contatos"`, cujo valor é **outro** objeto (pois este também está delimitado por `{` e `}`)
    - este objeto, por sua vez, possui duas chaves:
        - `"telefone"`: cujo valor é a string `"(11) 91111-2222"`
        - `"emails"`: cujo valor é um array (pois está delimitado por colchetes)
            - este array, por sua vez, possui dois elementos: as strings `"fulano@gmail.com"` e `"fulano@yahoo.com"`

Outro exemplo:

```javascript
[
    {
        "nome": "Fulano",
        "idade": 90
    },
    {
        "nome": "Ciclano",
        "idade": 10,
        "email": "ciclano@gmail.com"
    }
]
```

O JSON acima é um array, pois está delimitado por `[` e `]`. Ele contém 2 elementos:

- o primeiro elemento é um objeto (pois está delimitado por `{` e `}`), que por sua vez possui duas chaves:
    - `"nome"`, cujo valor é a string `"Fulano"`
    - `"idade"`, cujo valor é o número `90`
- o segundo elemento também é um objeto (pois está delimitado por `{` e `}`), que por sua vez possui três chaves:
    - `"nome"`, cujo valor é a string `"Ciclano"`
    - `"idade"`, cujo valor é o número `10`
    - `"email"`, cujo valor é a  string `"ciclano@gmail.com"`

Repare que depois do fechamento do primeiro objeto (ou seja, depois do `}`) há uma vírgula, que é o separador de elementos de um array. Da mesma forma que um array de números teria a vírgula entre cada número (como por exemplo `[ 1, 2, 3 ]`), um array de objetos também deve ter a vírgula separando-os.

## Regra básica para ler um JSON

A regra básica é: antes de sair escrevendo código, **pare e olhe** para o JSON. Veja se ele é um objeto ou array (que é o que a grande maioria das APIs REST retorna hoje em dia): se começa com `{` é um objeto, se começa com `[` é um array.

Depois veja o que tem dentro desse objeto ou array. Se for um array, procure pelas vírgulas que separam os elementos e verifique os seus tipos, e preocupe-se com a ordem em que eles estão, para saber como obter cada um. Se for um objeto, veja quais são as chaves e os respectivos valores.

Se o JSON é muito grande e/ou com muitas estruturas aninhadas (objetos dentro de arrays, dentro outros arrays, dentro de outros objetos, etc), formatá-lo ajuda a visualizar a sua estrutura. Há vários sites como [esse](https://jsonlint.com/), que validam e formatam um JSON. Além disso, as linguagens/APIs que trabalham com JSON geralmente possuem uma opção para formatá-lo (veremos alguns exemplos mais abaixo).

Outro ponto importante é verificar se o JSON que você está tentando ler é de fato um JSON válido. Um exemplo clássico é:

```javascript
{
    "nome": "Fulano",
    "idade": 90
},
{
    "nome": "Ciclano",
    "idade": 10
}
```

Inicialmente você pode pensar que, como começa com `{`, então é um objeto. Mas repare bem: o primeiro objeto (o que tem `"nome": "Fulano"`) termina na quarta linha (onde há o `}`), e logo em seguida há uma vírgula. Logo depois, temos **outro** objeto (o que tem `"nome": "Ciclano"`).

**Este não é um JSON válido**. Há dois objetos "soltos", separados por vírgula. **Cada um deles individualmente** é um JSON válido, mas ter ambos separados por vírgula não é.

O que poderia deixar esta estrutura válida é colocá-la entre `[` e `]`:

```javascript
[
  {
    "nome": "Fulano",
    "idade": 90
  },
  {
    "nome": "Ciclano",
    "idade": 10
  }
]
```

Pois agora ela se tornou um array com dois objetos. Mas da forma que estava (sem o `[` e `]`), a estrutura é inválida, e muitas APIs dão erro ao tentar processá-la (ou ignoram o segundo objeto, varia conforme a implementação).

Depois de ler o JSON e verificar se ele é um array ou objeto, você pode acessar seus elementos. Cada linguagem fornece seu mecanismo para tal, e abaixo coloquei exemplos em algumas linguagens.

---
Antes de prosseguir, um detalhe importante: JSON é um formato para troca de dados, ou seja, para informações que serão mandadas "para lá e para cá". E no fim, tudo isso vira texto (um monte de caracteres que você vai ter que interpretar). O que quer dizer que todos os exemplos de JSON que vimos até agora são na verdade strings (ou o resultado retornado por uma API, ou um arquivo).

Se eu consulto uma API e ela retorna `{ "nome": "Fulano", "idade": 90 }`, o que eu terei é uma **string** que contém o caractere `{`, depois o espaço, depois a aspas, depois a letra `n` e assim por diante. O que as APIs de JSON fazem é transformar esta string em alguma estrutura similar na linguagem em questão (geralmente arrays/listas e maps/dicionários/objects, além dos tipos numéricos e strings da própria linguagem). Sempre veja a documentação para saber como é feito o mapeamento entre tipos.

Agora sim, vamos ao código. Para todos os exemplos abaixo, usarei este JSON:

```javascript
{
    "nome": "Fulano",
    "idade": 90,
    "filmes_preferidos": [ "Pulp Fiction", "Clube da Luta" ],
    "contatos": {
        "telefone": "(11) 91111-2222",
        "emails": [ "fulano@gmail.com", "fulano@yahoo.com" ]
    }
}
```

Se quiser, pode usar os links abaixo para ir direto para a sua linguagem de sua preferência:

{% include languages.html languages="java,csharp,python,php,javascript,regex" %}

<sup>Mas já adianto que o exemplo em Java é um _pouquinho_ mais completo que os demais, por ser a linguagem com a qual tenho mais familiaridade.</sup>

### Java

No Java existem várias APIs disponíveis, como o pacote [`org.json`](https://mvnrepository.com/artifact/org.json/json/) e a biblioteca [Gson do Google](https://github.com/google/gson). Todas são bem parecidas, possuindo classes para representar objetos e arrays. Um exemplo com `org.json`:

```java
import org.json.JSONArray;
import org.json.JSONObject;

String texto = "{ \"nome\": \"Fulano\", \"idade\": 90, \"filmes_preferidos\": [ \"Pulp Fiction\", \"Clube da Luta\" ],"
                + " \"contatos\": { \"telefone\": \"(11) 91111-2222\", \"emails\": [ \"fulano@gmail.com\", \"fulano@yahoo.com\" ]  } }";
// cria o JSONObject
JSONObject obj = new JSONObject(texto);
// verifica se possui a chave "nome"
if (obj.has("nome")) {
    System.out.println("possui nome=" + obj.getString("nome")); // nome é uma String
} else {
    System.out.println("não possui nome");
}
// obtém o array de filmes
JSONArray filmes = obj.getJSONArray("filmes_preferidos");
filmes.forEach(System.out::println); // imprime todos os filmes
// obtém o objeto com os contatos
JSONObject contatos = obj.getJSONObject("contatos");
for (String chave : contatos.keySet()) {
    System.out.println(chave + "=" + contatos.get(chave));
}
//----------------------------------------------------------
// adicionar mais um contato
contatos.put("twitter", "@fulano");
// imprime o JSON formatado (indentando com 2 espaços)
System.out.println(obj.toString(2));
```

A primeira parte pega uma `String` contendo todo o JSON e transforma em um `JSONObject`. Em seguida eu uso o método `has` para verificar se o objeto possui determinada chave e o método `getString` para obter o valor de uma chave como uma `String`.

Depois eu uso `getJSONArray` para obter o array correspondente à chave `"filmes_preferidos"` e percorro o mesmo, imprimindo cada um dos seus valores. Também faço algo similar com a chave `"contatos"`, obtendo o objeto correspondente (com `getJSONObject`) e percorrendo todas suas chaves e valores. Até este ponto, a saída é:

```
possui nome=Fulano
Pulp Fiction
Clube da Luta
emails=["fulano@gmail.com","fulano@yahoo.com"]
telefone=(11) 91111-2222
```

Repare como os elementos do array (`"Pulp Fiction"` e `"Clube da Luta"`) mantêm a sua ordem, já que em um array a ordem dos elementos é importante. Já as chaves do objeto "contatos" aparecem fora de ordem (na `String` original, `"telefone"` estava antes de `"emails"`, mas ao percorrer o objeto, elas são retornadas em outra ordem), pois em um objeto não importa a ordem das chaves - e a ordem mostrada vai depender dos detalhes internos de implementação da API. Mas note que a chave `"emails"` possui como valor um array com os endereços de email, e dentro deste array, a ordem dos elementos é preservada.

Por fim, eu uso o método `put` para adicionar mais um par "chave: valor" ao objeto `"contatos"`, e uso o método `toString()`, passando como parâmetro a quantidade de espaços usada para formatar o JSON (no caso, usei 2 espaços). A saída é:

```
{
  "idade": 90,
  "filmes_preferidos": [
    "Pulp Fiction",
    "Clube da Luta"
  ],
  "contatos": {
    "emails": [
      "fulano@gmail.com",
      "fulano@yahoo.com"
    ],
    "telefone": "(11) 91111-2222",
    "twitter": "@fulano"
  },
  "nome": "Fulano"
}
```

Repare novamente que nos arrays a ordem dos elementos é mantida, mas nas chaves dos objetos, não necessariamente é a mesma. **Lembre-se que em um objeto JSON, a ordem das chaves não importa, e portanto nenhuma implementação é obrigada a manter a mesma ordem**.

Se a variável `texto` tivesse um array em vez de um objeto, bastaria você usar `new JSONArray(texto)`.

Caso o JSON seja inválido, os construtores de `JSONObject` e `JSONArray` lançam um `org.json.JSONException`.

---
Com a API Gson, podemos ir além e mapear o JSON para um objeto específico. Para o nosso JSON, podemos criar uma classe `Pessoa`, por exemplo:

```java
import java.util.List;
import java.util.Map;
import com.google.gson.annotations.SerializedName;

public class Pessoa {
    private String nome;
    private int idade;
    @SerializedName("filmes_preferidos")
    private List<String> filmesPreferidos;
    private Map<String, Object> contatos;
    // construtores, getters, setters, etc...
}
```

Com isso, podemos ler o JSON e criar uma instância de `Pessoa` com os campos já preenchidos:

```java
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

String texto = "{ \"nome\": \"Fulano\", \"idade\": 90, \"filmes_preferidos\": [ \"Pulp Fiction\", \"Clube da Luta\" ],"
                + " \"contatos\": { \"telefone\": \"(11) 91111-2222\", \"emails\": [ \"fulano@gmail.com\", \"fulano@yahoo.com\" ]  } }";
Gson gson = new GsonBuilder().setPrettyPrinting().create();
// lê o JSON e cria uma Pessoa com os campos preenchidos
Pessoa pessoa = gson.fromJson(texto, Pessoa.class);
System.out.println("nome=" + pessoa.getNome());
for (String filme : pessoa.getFilmesPreferidos()) {
    System.out.println(filme);
}
for (Map.Entry<String, Object> contato : pessoa.getContatos().entrySet()) {
    System.out.println(contato.getKey() + "=" + contato.getValue());
}

// adicionar um novo contato
pessoa.getContatos().put("twitter", "@fulano");
System.out.println(gson.toJson(pessoa));
```

Com isso fica bem mais fácil obter os campos do JSON e adicionar novas informações ao mesmo. A saída é:

```
nome=Fulano
Pulp Fiction
Clube da Luta
telefone=(11) 91111-2222
emails=[fulano@gmail.com, fulano@yahoo.com]
{
  "nome": "Fulano",
  "idade": 90,
  "filmes_preferidos": [
    "Pulp Fiction",
    "Clube da Luta"
  ],
  "contatos": {
    "telefone": "(11) 91111-2222",
    "emails": [
      "fulano@gmail.com",
      "fulano@yahoo.com"
    ],
    "twitter": "@fulano"
  }
}
```

Claro que, dependendo da situação, nem sempre é desejável mapear o JSON para uma classe. Pode ser que sejam muitos dados e você não precise de todos, então não vale a pena mapear tudo, por exemplo. Neste caso, você pode usar um `java.util.Map`:

```java
Map json = gson.fromJson(texto, Map.class);
```

Assim, o JSON vira um `Map`, sendo que as chaves são `Strings` e os valores podem ser `List`, `Map`, `String`, `Double`, etc, dependendo do que eles eram no JSON original. Para obter o telefone, por exemplo, você poderia fazer `((Map) json.get("contatos")).get("telefone")`. Não é muito "bonito", mas se você só precisa deste campo, e o JSON é muito grande e complexo, talvez não valha a pena mapeá-lo para uma classe só para obter um único campo.

Além disso, a classe `Gson` possui métodos que trabalham com `java.io.Reader` e `java.io.Writer`, permitindo que o JSON seja lido e escrito de/para arquivos e quaisquer outros *streams* de dados diretamente.

Se o JSON for inválido, o método `fromJSON` lança um `com.google.gson.JsonSyntaxException`.

### C#

Em C# existem várias APIs diferentes para manipular JSON, como você pode ver [neste comparativo](http://sagistech.blogspot.com/2010/03/parsing-twitter-json-comparing-c.html). Pelo que vi, são todas bem parecidas em termos de funcionamento básico. Segue abaixo um exemplo com o [Json.NET](https://www.newtonsoft.com/json):

```c#
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

string texto = "{ \"nome\": \"Fulano\", \"idade\": 90, \"filmes_preferidos\": [ \"Pulp Fiction\", \"Clube da Luta\" ],"
                + " \"contatos\": { \"telefone\": \"(11) 91111-2222\", \"emails\": [ \"fulano@gmail.com\", \"fulano@yahoo.com\" ]  } }";
dynamic dobj = JsonConvert.DeserializeObject<dynamic>(texto);
// obter nome
Console.WriteLine(dobj["nome"].ToString());
// percorrer array de filmes
foreach (string filme in dobj["filmes_preferidos"])
{
    Console.WriteLine(filme);
}
// percorrer contatos
foreach (JProperty c in dobj["contatos"])
{
    Console.WriteLine($"{c.Name} = {c.Value}");
}

// incluir novo contato
dobj["contatos"]["twitter"] = "@fulano";
Console.WriteLine(JsonConvert.SerializeObject(dobj, Formatting.Indented));
```

Fazemos algo parecido com o código anterior em [Java]({{ post.url }}#java): imprimimos o nome, depois percorremos o array de filmes e por fim os contatos. Depois criamos um novo contato. A saída é:

```
Fulano
Pulp Fiction
Clube da Luta
telefone = (11) 91111-2222
emails = [
  "fulano@gmail.com",
  "fulano@yahoo.com"
]
{
  "nome": "Fulano",
  "idade": 90,
  "filmes_preferidos": [
    "Pulp Fiction",
    "Clube da Luta"
  ],
  "contatos": {
    "telefone": "(11) 91111-2222",
    "emails": [
      "fulano@gmail.com",
      "fulano@yahoo.com"
    ],
    "twitter": "@fulano"
  }
}
```

Se o JSON for inválido, é lançado um `Newtonsoft.Json.JsonReaderException`. Veja mais exemplos com outras bibliotecas [aqui](https://pt.stackoverflow.com/q/706/112052).

### Python

Em Python, você pode usar o [módulo `json`](https://docs.python.org/3.6/library/json.html). A conversão de tipos do JSON de/para o Python é feita com base [nesta tabela](https://docs.python.org/3.6/library/json.html#json-to-py-table):

| JSON          | Python |
|:--------------|:-------|
| object        | dict   |
| array         | list   |
| string        | str    |
| number (int)  | int    |
| number (real) | float  |
| true          | True   |
| false         | False  |
| null          | None   |

Portanto, objetos JSON serão transformados em [dicionários](https://docs.python.org/3.6/library/stdtypes.html#dict), e arrays serão transformados em [listas](https://docs.python.org/3.6/library/stdtypes.html#list). Com isso fica fácil manipular o JSON:

```python
import json

texto = """
{
    "nome": "Fulano",
    "idade": 90,
    "filmes_preferidos": [ "Pulp Fiction", "Clube da Luta" ],
    "contatos": {
        "telefone": "(11) 91111-2222",
        "emails": [ "fulano@gmail.com", "fulano@yahoo.com" ]
    }
}
"""

obj = json.loads(texto)
# obter o nome
print(obj['nome'])
# percorrer o array de filmes
for filme in obj['filmes_preferidos']:
    print(filme)
# percorrer as chaves e valores do objeto "contatos"
for tipo, contato in obj['contatos'].items():
    print('{}={}'.format(tipo, contato))

# incluir um novo contato
obj['contatos']['twitter'] = '@fulano'
# imprimir o json (indentando com 2 espaços)
print(json.dumps(obj, indent=2))
```

Para transformar uma string que contém um JSON nos objetos correspondentes do Python, basta usar o método [`loads`](https://docs.python.org/3/library/json.html#json.loads). Como o JSON é um objeto, o retorno de `loads` é um dicionário, que podemos manipular normalmente, como qualquer outro dicionário do Python. O mesmo vale para os seus valores. A chave `"filmes_preferidos"`, por exemplo, contém um array, que o método `loads` transforma em uma lista. Já a chave `"contatos"` possui um objeto, e portanto ela se torna um dicionário. Para percorrê-los, usamos as formas tradicionais da linguagem, como faríamos com qualquer outra lista ou dicionário.

Para modificar o JSON, é a mesma coisa: basta manipular as listas e dicionários normalmente, adicionando, removendo ou mudando seus elementos. Por fim, podemos gerar uma string contendo todo o JSON, usando o método [`dumps`](https://docs.python.org/3/library/json.html#json.dumps). Usei o parâmetro `indent=2` para que o JSON fique bem formatado, usando 2 espaços para indentação. A saída do código acima é:

```
Fulano
Pulp Fiction
Clube da Luta
telefone=(11) 91111-2222
emails=['fulano@gmail.com', 'fulano@yahoo.com']
{
  "nome": "Fulano",
  "idade": 90,
  "filmes_preferidos": [
    "Pulp Fiction",
    "Clube da Luta"
  ],
  "contatos": {
    "telefone": "(11) 91111-2222",
    "emails": [
      "fulano@gmail.com",
      "fulano@yahoo.com"
    ],
    "twitter": "@fulano"
  }
}
```

Existem ainda os métodos [`load`](https://docs.python.org/3/library/json.html#json.load) e [`dump`](https://docs.python.org/3/library/json.html#json.dump), que em vez de ler e escrever o JSON de/para strings, faz a leitura e escrita em arquivos:

```python
# ler de um arquivo
with open('entrada.json', 'r') as arq:
    obj = json.load(arq)
    # manipular o obj ...

# gravar obj em outro arquivo
with open('saida.json', 'w') as arq:
    json.dump(obj, arq, indent=2)
```

Se o JSON for inválido, os métodos `loads` e `load` lançam um [`JSONDecodeError`](https://docs.python.org/3/library/json.html#json.JSONDecodeError).

### PHP

Em PHP, você pode usar a função [`json_decode`](https://www.php.net/manual/en/function.json-decode.php) para transformar uma string contendo um JSON no objeto correspondente. O primeiro parâmetro é a string contendo o JSON, e o segundo parâmetro (opcional) controla o tipo que será retornado. No exemplo abaixo eu passo `true`, indicando que o retorno será um array associativo:

```php
$texto = <<<JSON
{
    "nome": "Fulano",
    "idade": 90,
    "filmes_preferidos": [ "Pulp Fiction", "Clube da Luta" ],
    "contatos": {
        "telefone": "(11) 91111-2222",
        "emails": [ "fulano@gmail.com", "fulano@yahoo.com" ]
    }
}
JSON;
// converte o texto para um array
$json = json_decode($texto, true);
// obter o nome
echo $json['nome'], PHP_EOL;
// percorrer o array de filmes
foreach ($json['filmes_preferidos'] as $filme) {
    echo $filme, PHP_EOL;
}
# percorrer os contatos
foreach ($json['contatos'] as $tipo => $contato) {
    echo "{$tipo} = ". (is_array($contato) ? implode(", ", $contato) : $contato), PHP_EOL;
}

// adicionar novo contato
$json['contatos']['twitter'] = '@fulano';
// imprimir o JSON formatado
echo json_encode($json, JSON_PRETTY_PRINT);
```

Com isso, cada chave do objeto JSON se torna uma chave no array associativo, e seus respectivos valores podem ser números, strings ou outros arrays. E para transformar esse array em uma string contendo todo o JSON, eu uso a função [`json_encode`](https://www.php.net/manual/en/function.json-encode.php). E também uso a opção `JSON_PRETTY_PRINT` para que ele fique formatado. A saída é:

```
Fulano
Pulp Fiction
Clube da Luta
telefone = (11) 91111-2222
emails = fulano@gmail.com, fulano@yahoo.com
{
    "nome": "Fulano",
    "idade": 90,
    "filmes_preferidos": [
        "Pulp Fiction",
        "Clube da Luta"
    ],
    "contatos": {
        "telefone": "(11) 91111-2222",
        "emails": [
            "fulano@gmail.com",
            "fulano@yahoo.com"
        ],
        "twitter": "@fulano"
    }
}
```

Se eu fizer apenas `json_decode($texto)` (ou `json_decode($texto, false)`), o retorno será um objeto em vez de um array. Com isso, o modo de acessar os elementos muda um pouco:

```php
// converte o texto para um objeto (e não mais um array)
$json = json_decode($texto, false);
// obter o nome
echo $json->nome, PHP_EOL;
// percorrer o array de filmes
foreach ($json->filmes_preferidos as $filme) {
    echo $filme, PHP_EOL;
}
# percorrer os contatos
foreach ($json->contatos as $tipo => $contato) {
    echo "{$tipo} = ". (is_array($contato) ? implode(", ", $contato) : $contato), PHP_EOL;
}

// adicionar novo contato
$json->contatos->twitter = '@fulano';
// imprimir o JSON formatado
echo json_encode($json, JSON_PRETTY_PRINT);
```

Se `$texto` contém um JSON inválido, `json_decode` retorna `NULL`.

### JavaScript

Em JavaScript, existe o [objeto `JSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON), que possui os métodos [`parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) (para transformar uma string contendo todo o JSON na estrutura correspondente do JavaScript - ou seja, um array, objeto, string, número, etc), e [`stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify), que faz o oposto (transforma uma variável do JavaScript em uma string no formato JSON).

No código abaixo estou usando [*Template Strings*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), por facilitar a criação de uma string com várias linhas. [Veja se seu browser é compatível com este recurso](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Browser_compatibility) (caso não seja, há uma alternativa abaixo, usando uma string tradicional).

```javascript
let texto = `{
    "nome": "Fulano",
    "idade": 90,
    "filmes_preferidos": [ "Pulp Fiction", "Clube da Luta" ],
    "contatos": {
        "telefone": "(11) 91111-2222",
        "emails": [ "fulano@gmail.com", "fulano@yahoo.com" ]
    }
}`;
// se o seu browser não suporta a template string acima, use a linha abaixo
//let texto = '{ "nome": "Fulano", "idade": 90, "filmes_preferidos": [ "Pulp Fiction", "Clube da Luta" ], "contatos": { "telefone": "(11) 91111-2222", "emails": [ "fulano@gmail.com", "fulano@yahoo.com" ] } }';

let json = JSON.parse(texto);
// imprimir nome
console.log(json.nome);
// imprimir filmes
json.filmes_preferidos.forEach(filme => console.log(filme));
// imprimir contatos
for (let [tipo, contato] of Object.entries(json.contatos)) {
    console.log(tipo, '=', Array.isArray(contato) ? contato.join() : contato);
}

// adicionar novo contato
json.contatos.twitter = '@fulano';
// transformar em string (indentado com 2 espaços)
console.log(JSON.stringify(json, null, 2));
```

Um objeto JSON se torna um objeto do JavaScript, e podemos acessar suas chaves diretamente (como fizemos com `json.nome` e `json.contatos`, por exemplo). Já um array JSON se torna um array do JavaScript, com todos os métodos que este possui, como o `forEach` utilizado acima.

Por fim, `JSON.stringify` possui uma opção para formatar a saída, bastando passar a quantidade de espaços usados para indentação. A saída é:

```
Fulano
Pulp Fiction
Clube da Luta
telefone = (11) 91111-2222
emails = fulano@gmail.com,fulano@yahoo.com
{
  "nome": "Fulano",
  "idade": 90,
  "filmes_preferidos": [
    "Pulp Fiction",
    "Clube da Luta"
  ],
  "contatos": {
    "telefone": "(11) 91111-2222",
    "emails": [
      "fulano@gmail.com",
      "fulano@yahoo.com"
    ],
    "twitter": "@fulano"
  }
}
```

Se o JSON for inválido, `JSON.parse` lança um [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError).

### Regex

Sendo bem sincero: [não use expressões regulares (regex) para ler e manipular um JSON](https://pt.stackoverflow.com/a/357086/112052). Não que seja impossível, mas antes avalie se você vai querer usar uma regex [como essa](https://stackoverflow.com/a/3845829):

```php
$pcre_regex = '
  /
  (?(DEFINE)
     (?<number>   -? (?= [1-9]|0(?!\d) ) \d+ (\.\d+)? ([eE] [+-]? \d+)? )    
     (?<boolean>   true | false | null )
     (?<string>    " ([^"\\\\]* | \\\\ ["\\\\bfnrt\/] | \\\\ u [0-9a-f]{4} )* " )
     (?<array>     \[  (?:  (?&json)  (?: , (?&json)  )*  )?  \s* \] )
     (?<pair>      \s* (?&string) \s* : (?&json)  )
     (?<object>    \{  (?:  (?&pair)  (?: , (?&pair)  )*  )?  \s* \} )
     (?<json>   \s* (?: (?&number) | (?&boolean) | (?&string) | (?&array) | (?&object) ) \s* )
  )
  \A (?&json) \Z
  /six   
';
```

Esta regex funciona com PHP. A opção `x` habilita o modo *extended*, no qual espaços e quebras de linha são ignorados pela regex, assim ela pode ser escrita de uma maneira mais "amigável" (não que ela seja fácil, mas imagine se estivesse tudo na mesma linha e sem espaços).

Em outras linguagens não é garantido que funcione, já que nem todas as *engines* possuem todos os recursos, e até mesmo a sintaxe de algumas estruturas pode ser diferente. Em Python é possível usá-la com o [módulo `regex` (disponível no PyPI)](https://pypi.org/project/regex/), mas o [módulo `re`](https://docs.python.org/3/library/re.html) nativo não suporta esta regex. Java e JavaScript também não possuem suporte a todos os recursos usados nesta expressão.

O ponto crucial desta regex são as [sub-rotinas](https://www.rexegg.com/regex-disambiguation.html#define), que nem todas as linguagens possuem (são os trechos com `(?&`). Outra limitação é que **a regex acima só verifica se o JSON é válido, mas não extrai os seus valores**.

Para obter uma estrutura que possui os valores devidamente separados e organizados (seja em um map, array, dicionário ou objeto), você terá que usar um *parser* específico, que a maioria das linguagens possuem. E os *parsers* que vimos acima já verificam se o JSON é válido, então para que usar a regex?

---

Com isso, acredito que agora você já está mais preparado para ler e manipular um JSON. Não é tão difícil: o grande problema - que pelo menos eu vejo - é que as pessoas não param para analisar a estrutura e já saem escrevendo código sem pensar. Se você olha a estrutura antes, consegue ver como percorrê-la, um nível de cada vez, até chegar na informação que você precisa.