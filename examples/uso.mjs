import { lerCSV, col } from '../src/index.js';

const texto = [
  'Nome [READ ONLY];Preço Unitário;Qtd',
  '"Cabo HDMI, 2m";39,90;3',
  'Monitor;"1.299,00";1',
].join('\n');

const { cabecalho, registros, separador, erros } = lerCSV(texto);

console.log('separador:', JSON.stringify(separador));   // ";"
console.log('cabecalho:', cabecalho);
console.log('erros:', erros);                            // [] — tudo alinhado

for (const r of registros) {
  console.log({
    nome: col(r, 'nome'),
    preco: col(r, 'preço unitário', 'preco'),
    qtd: col(r, 'qtd', 'quantidade'),
    linha: r.__linha,
  });
}
