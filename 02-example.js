// import '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

// const list_sentences = [
//   'Will it snow tomorrow?',
//   'Recently a lot of hurricanes have hit the US',
//   'Global warming is real',

//   'An apple a day, keeps the doctors away',
//   'Eating strawberries is healthy',

//   'what is your age?',
//   'How old are you?',
//   'How are you?',

//   'The dog bit Johnny',
//   'Johnny bit the dog',

//   'The cat ate the mouse',
//   'The mouse ate the cat',
// ];

const list_sentences = [
  'Annabelle Um casal se prepara para a chegada de sua primeira filha e compra para ela uma boneca. Quando sua casa é invadida por membros de uma seita, o casal é violentamente atacado e a boneca, Annabelle, se torna recipiente de uma entidade do mal.',
  'Os Dez Mandamentos: O Filme Com efeitos especiais grandiosos e uma história emocionante, o filme produzido pela Record conta uma das mais famosas passagens da Bíblia: a saga de Moisés, desde seu nascimento até a chegada de seu povo à Terra Prometida, passando pela fuga do Egito através do Mar Vermelho e o encontro com Deus no Monte Sinai. Livre adaptação dos livros Êxodo, Levítico, Números e Deuteronômio, o filme cobre mais de cem anos de história, em tramas recheadas de emoção.',
];

get_embeddings(list_sentences);

function get_embeddings(list_sentences) {
  use.load().then((model) => {
    console.log('entro no use');
    model.embed(list_sentences).then((embeddings) => {
      findSimilarity(embeddings);
    });
  });
}

function dot(a, b) {
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var sum = 0;
  for (var key in a) {
    if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
      sum += a[key] * b[key];
    }
  }
  return sum;
}

function similarity(a, b) {
  var magnitudeA = Math.sqrt(dot(a, a));
  var magnitudeB = Math.sqrt(dot(b, b));
  if (magnitudeA && magnitudeB) return dot(a, b) / (magnitudeA * magnitudeB);
  else return false;
}

function cosine_similarity_matrix(matrix) {
  let cosine_similarity_matrix = [];
  for (let i = 0; i < matrix.length; i++) {
    let row = [];
    for (let j = 0; j < i; j++) {
      row.push(cosine_similarity_matrix[j][i]);
    }
    row.push(1);
    for (let j = i + 1; j < matrix.length; j++) {
      row.push(similarity(matrix[i], matrix[j]));
    }
    cosine_similarity_matrix.push(row);
  }
  return cosine_similarity_matrix;
}

function findSimilarity(embeddings) {
  var matrix = cosine_similarity_matrix(embeddings.arraySync());

  let data = [
    {
      z: matrix,
      x: list_sentences,
      y: list_sentences,
    },
  ];
  console.log(data[0].z[0][1]);
}
