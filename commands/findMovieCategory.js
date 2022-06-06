import brain from 'brain.js';
import fs from 'fs';
import trainees from '../trainees.js';

export const findMovieCategory = (message, movieData) => {
  movieData.overview = movieData.overview.replaceAll('"', '');
  movieData.title = movieData.title.replaceAll('"', '');

  fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
    if (err)
      return message.channel.send(
        `Ops! Ocorreu um erro ao ler meus dados :(\n       Erro: ${err}`
      );

    let obj = JSON.parse(data);
    obj.push({
      text: movieData.title + ' ' + movieData.overview,
      category: 'ação',
    });
    let json = JSON.stringify(obj);

    fs.writeFile('data.json', json, 'utf8', function (err) {
      if (err)
        return message.channel.send(
          `Ops! Ocorreu um erro ao gravar a sinopse :(\n       Erro: ${err}`
        );

      return message.channel.send(`Aprendi uma nova sinopse :)`);
    });
  });

  // const network = new brain.recurrent.LSTM();

  // const trainingData = data.map((item) => ({
  //   input: item.text,
  //   output: item.category,
  // }));

  // network.train(trainingData, {
  //   iterations: 2000,
  // });

  // const output = network.run(`${movieData.title} ${movieData.overview}`);
  // message.channel.send(`Categoria: ${output}`);
};
