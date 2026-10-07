# csv-colunas

**Language:** [PT-BR](README.md) · **EN-US** · [es-AR](README.es-AR.md)

A CSV reader that copes with the **quirks of each source**: quotes, mixed separators, BOM, headers that move and rename themselves. Pure logic, zero dependencies, Node and browser.

## Why

CSV files rarely arrive in the same shape. One source uses commas with escaped quotes; another uses semicolons and starts with a BOM; another exports headers with bracketed suffixes (`Name [READ ONLY]`); sometimes there is a line break **inside** a quoted field. And column order changes between exports — the name does not.

`csv-colunas` handles that: it detects the separator, strips the BOM, honors quotes (including embedded newlines and `""` escaping), normalizes headers and finds columns by **approximate name**. It also returns **per-line diagnostics** and enforces an explicit **size limit**.

## Install

```bash
npm install csv-colunas
```

Or copy `src/index.js` — a dependency-free ESM module.

## Usage

```js
import { lerCSV, col } from 'csv-colunas';

const { cabecalho, registros, separador, erros } = lerCSV(text);

for (const r of registros) {
  const name  = col(r, 'nome', 'name');     // by name, not by position
  const price = col(r, 'preço unitário', 'price');
  // r.__linha = line number in the original file
}
```

Each record is an object keyed by **normalized header names**. `col()` matches by exact name, then by inclusion, accepting several alternative names.

## API

| function | description |
|---|---|
| `lerCSV(text, { separador?, limiteBytes? })` | `{ cabecalho, chaves, registros, separador, erros }` |
| `registrosDeMatriz(matrix)` | same output from a matrix of cells (e.g. a spreadsheet API) |
| `col(record, ...names)` | first value whose column matches (exact → inclusion) |
| `dividirLinha(line, sep)` | split a line honoring quotes |
| `separarLinhas(text)` | split into lines without breaking quotes |
| `normalizarChave(name)` | strip `[TAGS]`, accents, case and punctuation |
| `detectarSeparador(firstLine)` | `,` `;` or `\t` |

`erros` lists rows whose column count differs from the header (`{ linha, esperado, encontrado }`); the row **still goes** into `registros`, so nothing is lost silently. `lerCSV` throws `RangeError` when the text exceeds `limiteBytes` (default 20 MB).

## Limitations

- Returns **strings**: no number, date or currency conversion (pair it with a separate parser).
- `__linha` is the physical line in the file; fully empty lines are skipped.
- No streaming: it reads the whole text in memory (hence the size limit).

## Tests

```bash
node --test
```

## License

MIT © Rodrigo Rodrigues
