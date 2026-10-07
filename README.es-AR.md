<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# csv-colunas

![csv-colunas](assets/support/project-es-ar.svg)

[![MIT](https://img.shields.io/github/license/Rdraim/csv-colunas?style=flat)](LICENSE) [![CI](https://img.shields.io/github/actions/workflow/status/Rdraim/csv-colunas/ci.yml?branch=main&label=CI&style=flat)](https://github.com/Rdraim/csv-colunas/actions) [![Release](https://img.shields.io/github/v/release/Rdraim/csv-colunas?style=flat)](https://github.com/Rdraim/csv-colunas/releases) [![Git](https://img.shields.io/github/last-commit/Rdraim/csv-colunas?label=Git&style=flat)](https://github.com/Rdraim/csv-colunas/commits/main) [![Stars](https://img.shields.io/github/stars/Rdraim/csv-colunas?style=social)](https://github.com/Rdraim/csv-colunas/stargazers) [![Forks](https://img.shields.io/github/forks/Rdraim/csv-colunas?style=social)](https://github.com/Rdraim/csv-colunas/forks)

<p>
  <a href="https://github.com/Rdraim/csv-colunas/tree/main/examples"><img src="assets/support/action-0-es-ar.svg" height="40" width="200" alt="Ver ejemplos"></a>
  <a href="https://github.dev/Rdraim/csv-colunas"><img src="assets/support/action-1-es-ar.svg" height="40" width="200" alt="Editar en GitHub"></a>
  <a href="https://github.com/Rdraim/csv-colunas/archive/refs/heads/main.zip"><img src="assets/support/action-2-es-ar.svg" height="40" width="200" alt="Descargar código"></a>
</p>



Un lector de CSV que tolera las **mañas de cada origen**: comillas, separadores variados, BOM, encabezados que cambian de lugar y de nombre. Lógica pura, sin dependencias, Node y navegador.

## Por qué

Los archivos CSV rara vez llegan con el mismo formato. Un origen usa coma con comillas escapadas; otro usa punto y coma y empieza con BOM; otro exporta encabezados con sufijos entre corchetes (`Nombre [READ ONLY]`); a veces hay un salto de línea **dentro** de un campo entre comillas. Y el orden de las columnas cambia entre exportaciones — el nombre, no.

`csv-colunas` resuelve eso: detecta el separador, quita el BOM, respeta las comillas (incluidos saltos de línea y `""` escapado), normaliza encabezados y encuentra la columna por **nombre aproximado**. Además devuelve **diagnóstico por línea** e impone un **límite de tamaño** explícito.

## Instalación

```bash
git clone https://github.com/Rdraim/csv-colunas.git
cd csv-colunas
npm test
```

O copiá `src/index.js` — módulo ESM sin dependencias.

## Uso

```js
import { lerCSV, col } from './src/index.js';

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

## ☕ Invitame un café

¿Este proyecto te ayudó a resolver un problema, aprender algo nuevo o dar tus primeros pasos en desarrollo? Si querés apoyar mi trabajo, un café es una linda forma de agradecer.

Soy **Rodrigo Rodrigues**, creador de **Nexus** y de estos proyectos de código abierto. Tu aporte me ayuda a dedicar tiempo a mejorar el código, escribir ejemplos más claros y seguir compartiendo lo que aprendo.

**Aportá el monto que tenga sentido para vos. El apoyo es totalmente voluntario; el proyecto sigue siendo gratuito bajo la licencia MIT.**

[Apoyá con Pix](#apoyá-con-pix) · [Dejá un comentario](https://github.com/Rdraim/csv-colunas/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3)

### Apoyá con Pix

En la app de tu banco, escaneá el QR o copiá la clave Pix de abajo. Elegí el monto y revisá los datos del destinatario antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Pix original proporcionado por Rodrigo Rodrigues; también podés usar la clave de texto de abajo.">
</p>

**Clave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Pix es el sistema de pagos de Brasil. Si tu banco no lo admite, también podés ayudar compartiendo el proyecto, reportando un problema, mejorando la documentación o dejando un comentario.

### Tu comentario también suma

[Contame cómo te ayudó el proyecto](https://github.com/Rdraim/csv-colunas/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3). Me gustaría saber qué creaste, qué aprendiste y qué podría ser más claro para quienes recién empiezan.

Los comentarios son bienvenidos con o sin donación. Cuidá tu privacidad: no publiques comprobantes de pago, datos personales, credenciales ni información privada de usuarios en las Issues.

**Gracias por apoyar mi trabajo y ayudarme a seguir creando y compartiendo. ❤️**
