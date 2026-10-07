# csv-colunas

**Idioma:** [PT-BR](README.md) · [EN-US](README.en-US.md) · **es-AR**

Un lector de CSV que tolera las **mañas de cada origen**: comillas, separadores variados, BOM, encabezados que cambian de lugar y de nombre. Lógica pura, sin dependencias, Node y navegador.

## Por qué

Los archivos CSV rara vez llegan con el mismo formato. Un origen usa coma con comillas escapadas; otro usa punto y coma y empieza con BOM; otro exporta encabezados con sufijos entre corchetes (`Nombre [READ ONLY]`); a veces hay un salto de línea **dentro** de un campo entre comillas. Y el orden de las columnas cambia entre exportaciones — el nombre, no.

`csv-colunas` resuelve eso: detecta el separador, quita el BOM, respeta las comillas (incluidos saltos de línea y `""` escapado), normaliza encabezados y encuentra la columna por **nombre aproximado**. Además devuelve **diagnóstico por línea** e impone un **límite de tamaño** explícito.

## Instalación

```bash
npm install csv-colunas
```

O copiá `src/index.js` — módulo ESM sin dependencias.

## Uso

```js
import { lerCSV, col } from 'csv-colunas';

const { cabecalho, registros, separador, erros } = lerCSV(texto);

for (const r of registros) {
  const nombre = col(r, 'nome', 'nombre');     // por nombre, no por posición
  const precio = col(r, 'preço unitário', 'precio');
  // r.__linha = número de línea en el archivo original
}
```

Cada registro es un objeto con las **claves normalizadas** del encabezado. `col()` busca por nombre exacto y, si no encuentra, por inclusión, aceptando varios nombres alternativos.

## API

| función | descripción |
|---|---|
| `lerCSV(texto, { separador?, limiteBytes? })` | `{ cabecalho, chaves, registros, separador, erros }` |
| `registrosDeMatriz(matriz)` | misma salida desde una matriz de celdas (ej.: API de planilla) |
| `col(registro, ...nombres)` | primer valor cuya columna coincida (exacto → inclusión) |
| `dividirLinha(linea, sep)` | divide una línea respetando comillas |
| `separarLinhas(texto)` | separa en líneas sin romper comillas |
| `normalizarChave(nombre)` | quita `[TAGS]`, acentos, mayúsculas y puntuación |
| `detectarSeparador(primeraLinea)` | `,` `;` o `\t` |

`erros` lista las filas cuya cantidad de columnas difiere del encabezado (`{ linha, esperado, encontrado }`); la fila **igual entra** en `registros`, para no perder datos en silencio. `lerCSV` lanza `RangeError` cuando el texto supera `limiteBytes` (por defecto 20 MB).

## Limitaciones

- Devuelve **strings**: no convierte número, fecha ni moneda (combinalo con un parser aparte).
- `__linha` es la línea física del archivo; las líneas totalmente vacías se ignoran.
- No hace streaming: lee todo el texto en memoria (de ahí el límite de tamaño).

## Tests

```bash
node --test
```

## Licencia

MIT © Rodrigo Rodrigues
