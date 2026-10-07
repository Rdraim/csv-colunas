import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerCSV, registrosDeMatriz, col, normalizarChave, detectarSeparador } from '../src/index.js';

test('respeita vírgula e aspas dentro do campo', () => {
  const { registros } = lerCSV('nome,valor\n"a,b",10');
  assert.equal(registros[0].nome, 'a,b');
  assert.equal(registros[0].valor, '10');
});

test('não quebra em quebra de linha dentro de aspas', () => {
  const { registros } = lerCSV('nome,obs\n"x","l1\nl2"');
  assert.equal(registros.length, 1);
  assert.equal(registros[0].obs, 'l1\nl2');
});

test('aspas duplas escapadas viram aspa literal', () => {
  const { registros } = lerCSV('nome\n"ele disse ""oi"""');
  assert.equal(registros[0].nome, 'ele disse "oi"');
});

test('remove BOM do início', () => {
  const { cabecalho } = lerCSV('﻿nome,valor\n1,2');
  assert.deepEqual(cabecalho, ['nome', 'valor']);
});

test('detecta ponto e vírgula e tabulação', () => {
  assert.equal(detectarSeparador('a;b;c'), ';');
  assert.equal(detectarSeparador('a\tb\tc'), '\t');
  assert.equal(detectarSeparador('a,b,c'), ',');
  assert.equal(lerCSV('a;b;c\n1;2;3').separador, ';');
});

test('normaliza cabeçalho: tira [TAGS] e acentos', () => {
  assert.equal(normalizarChave('Nome [READ ONLY]'), 'nome');
  assert.equal(normalizarChave('Preço Unitário'), 'preco unitario');
});

test('col encontra por nome exato e por inclusão', () => {
  const { registros } = lerCSV('Preço,Valor Total\n5,9');
  assert.equal(col(registros[0], 'preço'), '5');
  assert.equal(col(registros[0], 'total'), '9');
  assert.equal(col(registros[0], 'inexistente'), '');
});

test('diagnóstico por linha quando a contagem de colunas difere', () => {
  const { registros, erros } = lerCSV('a,b\n1,2\n3,4,5');
  assert.equal(registros.length, 2);          // a linha torta ainda entra
  assert.equal(erros.length, 1);
  assert.deepEqual(erros[0], { linha: 3, esperado: 2, encontrado: 3 });
});

test('limite de tamanho é explícito (lança RangeError)', () => {
  assert.throws(() => lerCSV('a,b\n1,2', { limiteBytes: 3 }), RangeError);
});

test('registrosDeMatriz lê de uma matriz de células', () => {
  const { registros } = registrosDeMatriz([['Nome', 'Idade'], ['Ana', '30'], ['', '']]);
  assert.equal(registros.length, 1);
  assert.equal(registros[0].nome, 'Ana');
  assert.equal(registros[0].idade, '30');
});
