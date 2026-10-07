/* ============================================================================
   csv-colunas — leitor de CSV tolerante às manias de origens diferentes.

   Arquivos de CSV chegam de origens distintas e cada uma tem sua mania:
   vírgula com aspas escapadas; ponto e vírgula começando com BOM; cabeçalhos
   com sufixos entre colchetes (ex.: "Nome [READ ONLY]"); quebras de linha
   dentro de campos entre aspas. Posição de coluna muda entre exportações, o
   nome não.

   Por isso: separador detectado, BOM removido, busca de coluna por nome
   aproximado, diagnóstico por linha e limite de tamanho explícito.
   ============================================================================ */

const LIMITE_PADRAO = 20 * 1024 * 1024; // 20 MB

/** Divide uma linha respeitando aspas: "a,b" é um campo só; "" é aspa literal. */
export function dividirLinha(linha, sep) {
  const campos = [];
  let atual = '';
  let dentroDeAspas = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') {
      if (dentroDeAspas && linha[i + 1] === '"') { atual += '"'; i++; }
      else dentroDeAspas = !dentroDeAspas;
    } else if (c === sep && !dentroDeAspas) {
      campos.push(atual);
      atual = '';
    } else {
      atual += c;
    }
  }
  campos.push(atual);
  return campos.map((s) => s.trim());
}

/** Quebra o texto em linhas sem cortar quebras que estão dentro de aspas. */
export function separarLinhas(texto) {
  const linhas = [];
  let atual = '';
  let dentroDeAspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === '"') {
      if (dentroDeAspas && texto[i + 1] === '"') { atual += '""'; i++; continue; }
      dentroDeAspas = !dentroDeAspas;
      atual += c;
    } else if ((c === '\n' || c === '\r') && !dentroDeAspas) {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      if (atual.trim()) linhas.push(atual);
      atual = '';
    } else {
      atual += c;
    }
  }
  if (atual.trim()) linhas.push(atual);
  return linhas;
}

/** Normaliza um nome de coluna: tira "[TAGS]", acentos, caixa e pontuação. */
export function normalizarChave(s) {
  return String(s ?? '')
    .replace(/\[[^\]]*\]/g, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Separador mais provável na primeira linha (fora das aspas). */
export function detectarSeparador(primeira) {
  const conta = (c) => dividirLinha(primeira, c).length;
  const porVirgula = conta(',');
  if (conta(';') > porVirgula) return ';';
  if (conta('\t') > porVirgula) return '\t';
  return ',';
}

/**
 * Lê um texto CSV.
 * @param {string} texto
 * @param {{ separador?: string, limiteBytes?: number }} [opcoes]
 * @returns {{ cabecalho, chaves, registros, separador, erros }}
 *   `erros` traz diagnósticos por linha (ex.: contagem de colunas diferente do
 *   cabeçalho); a linha ainda é incluída, para não perder dado silenciosamente.
 */
export function lerCSV(texto, opcoes = {}) {
  const bruto = String(texto || '');
  const limite = opcoes.limiteBytes ?? LIMITE_PADRAO;
  const bytes = Buffer.byteLength ? Buffer.byteLength(bruto, 'utf8') : bruto.length;
  if (bytes > limite) {
    throw new RangeError(`CSV excede o limite: ${bytes} bytes > ${limite} bytes`);
  }

  const limpo = bruto.replace(/^﻿/, ''); // remove BOM
  const linhas = separarLinhas(limpo);
  if (!linhas.length) return { cabecalho: [], chaves: [], registros: [], separador: opcoes.separador || ',', erros: [] };

  const sep = opcoes.separador || detectarSeparador(linhas[0]);
  const cabecalho = dividirLinha(linhas[0], sep);
  const chaves = cabecalho.map(normalizarChave);

  const registros = [];
  const erros = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = dividirLinha(linhas[i], sep);
    if (valores.every((v) => !v)) continue;
    const nLinha = i + 1;
    if (valores.length !== cabecalho.length) {
      erros.push({ linha: nLinha, esperado: cabecalho.length, encontrado: valores.length });
    }
    const reg = {};
    chaves.forEach((k, j) => { if (k) reg[k] = valores[j] ?? ''; });
    reg.__linha = nLinha;
    registros.push(reg);
  }
  return { cabecalho, chaves, registros, separador: sep, erros };
}

/** Mesma saída de `lerCSV`, mas a partir de uma MATRIZ (linhas de células) — é
   o formato que APIs de planilha costumam devolver. Primeira linha = cabeçalho. */
export function registrosDeMatriz(matriz) {
  const linhas = (matriz || []).filter((l) => Array.isArray(l));
  if (!linhas.length) return { cabecalho: [], chaves: [], registros: [] };
  const cabecalho = (linhas[0] || []).map((c) => String(c ?? '').trim());
  const chaves = cabecalho.map(normalizarChave);
  const registros = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i] || [];
    if (valores.every((v) => !String(v ?? '').trim())) continue;
    const reg = {};
    chaves.forEach((k, j) => { if (k) reg[k] = String(valores[j] ?? '').trim(); });
    reg.__linha = i + 1;
    registros.push(reg);
  }
  return { cabecalho, chaves, registros };
}

/** Pega a primeira coluna cujo nome bata (exato, depois por inclusão). */
export function col(registro, ...nomes) {
  for (const n of nomes) {
    const k = normalizarChave(n);
    if (registro[k] != null && registro[k] !== '') return registro[k];
  }
  for (const n of nomes) {
    const k = normalizarChave(n);
    const achou = Object.keys(registro).find((x) => x !== '__linha' && (x === k || x.includes(k)));
    if (achou && registro[achou]) return registro[achou];
  }
  return '';
}

export default { dividirLinha, separarLinhas, normalizarChave, detectarSeparador, lerCSV, registrosDeMatriz, col };
