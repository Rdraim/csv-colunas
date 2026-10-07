# csv-colunas

**Idioma:** **PT-BR** · [EN-US](README.en-US.md) · [es-AR](README.es-AR.md)

Leitor de CSV que aguenta as **manias de cada origem**: aspas, separador variado, BOM, cabeçalhos que mudam de posição e de nome. Lógica pura, sem dependências, Node e navegador.

## Por quê

Arquivos de CSV raramente vêm no mesmo formato. Uma origem usa vírgula com aspas escapadas; outra usa ponto e vírgula e começa com BOM; outra exporta cabeçalhos com sufixos entre colchetes (`Nome [READ ONLY]`); às vezes há quebra de linha **dentro** de um campo entre aspas. E a posição das colunas muda entre exportações — o nome, não.

`csv-colunas` resolve isso: detecta o separador, remove o BOM, respeita aspas (inclusive quebras de linha e `""` escapado), normaliza cabeçalhos e acha coluna por **nome aproximado**. Ainda devolve **diagnóstico por linha** e impõe um **limite de tamanho** explícito.

## Instalação

```bash
npm install csv-colunas
```

Ou copie `src/index.js` — módulo ESM sem dependências.

## Uso

```js
import { lerCSV, col } from 'csv-colunas';

const { cabecalho, registros, separador, erros } = lerCSV(texto);

for (const r of registros) {
  const nome  = col(r, 'nome');                 // por nome, não por posição
  const preco = col(r, 'preço unitário', 'preco');
  // r.__linha = número da linha no arquivo original
}
```

Cada registro é um objeto com as **chaves normalizadas** do cabeçalho. `col()` busca a coluna por nome exato e, se não achar, por inclusão — aceitando vários nomes alternativos.

## API

| função | descrição |
|---|---|
| `lerCSV(texto, { separador?, limiteBytes? })` | `{ cabecalho, chaves, registros, separador, erros }` |
| `registrosDeMatriz(matriz)` | mesma saída, a partir de uma matriz de células (ex.: API de planilha) |
| `col(registro, ...nomes)` | primeiro valor cuja coluna bata (exato → inclusão) |
| `dividirLinha(linha, sep)` | divide uma linha respeitando aspas |
| `separarLinhas(texto)` | quebra em linhas sem cortar aspas |
| `normalizarChave(nome)` | tira `[TAGS]`, acentos, caixa e pontuação |
| `detectarSeparador(primeiraLinha)` | `,` `;` ou `\t` |

`erros` lista linhas cuja contagem de colunas difere do cabeçalho (`{ linha, esperado, encontrado }`); a linha **ainda entra** em `registros`, para não perder dado em silêncio. `lerCSV` lança `RangeError` quando o texto passa de `limiteBytes` (padrão 20 MB).

## Limitações

- Entrega **strings**: não converte número, data nem moeda (combine com um parser à parte).
- `__linha` é a linha física no arquivo; linhas totalmente vazias são ignoradas.
- Não faz streaming: lê o texto inteiro em memória (por isso o limite de tamanho).

## Testes

```bash
node --test
```

## Licença

MIT © Rodrigo Rodrigues
