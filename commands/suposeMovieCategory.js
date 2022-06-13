import '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

var scoresGlobal = [];

export const suposeMovieCategory = async (message, movieData, jsonData) => {
  message.channel.send(`Analisando...`);
  // const inicio = performance.now();

  let jsonMovieTexts = [];
  Object.keys(jsonData).map((key) => [
    jsonMovieTexts.push(jsonData[key]['text']),
  ]);

  scoresGlobal = [];
  await makeEmbeddings(jsonMovieTexts, movieData);

  let scores = [];
  Object.keys(scoresGlobal).map((key) => [
    scores.push(scoresGlobal[key]['score']),
  ]);

  const highestScoreIndex = scores.reduce(
    (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
    0
  );

  const category = jsonData.find(
    (item) => item.text === scoresGlobal[highestScoreIndex].textCompared
  );

  // const fim = performance.now();
  // console.log(`A operação levou ${fim - inicio} milissegundos`);
  return message.channel.send(`Categoria: ${category.category}`);
};

async function makeEmbeddings(jsonMovieTexts, movieData) {
  // const inicio = performance.now();
  await Promise.all(
    jsonMovieTexts.map(async (movieText) => {
      let compare_sentences = [movieText, movieData.title];
      await get_embeddings(compare_sentences);
    })
  );
  // const fim = performance.now();
  // console.log(`A operação levou ${fim - inicio} milissegundos`);
}

async function get_embeddings(compare_sentences) {
  // const inicio = performance.now();
  await use.load().then(async (model) => {
    await model.embed(compare_sentences).then((embeddings) => {
      return findSimilarity(embeddings, compare_sentences);
    });
  });
  // const fim = performance.now();
  // console.log(`A operação levou ${fim - inicio} milissegundos`);
}

function findSimilarity(embeddings, compare_sentences) {
  var matrix = cosine_similarity_matrix(embeddings.arraySync());

  console.log('retornou matrix:' + matrix[0][1] + compare_sentences[0]);

  let comparison = {
    score: matrix[0][1],
    textCompared: compare_sentences[0],
  };
  scoresGlobal.push(comparison);
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

function similarity(a, b) {
  var magnitudeA = Math.sqrt(dot(a, a));
  var magnitudeB = Math.sqrt(dot(b, b));
  if (magnitudeA && magnitudeB) return dot(a, b) / (magnitudeA * magnitudeB);
  else return false;
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
