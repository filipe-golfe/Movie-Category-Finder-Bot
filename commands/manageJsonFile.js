import fs from 'fs';
import { suposeMovieCategory } from './suposeMovieCategory.js';

export const manageJsonFile = (message, movieData, genreName) => {
  movieData.overview = movieData.overview.replace(/['"]+/g, '');
  movieData.title = movieData.title.replace(/['"]+/g, '');

  fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
    if (err)
      return message.channel.send(
        `Ops! Ocorreu um erro ao ler meus dados :(\n       Erro: ${err}`
      );

    let jsonData = JSON.parse(data);

    if (movieData.overview.length + movieData.title.length < 75) {
      return tooFewArgumentsInMovieToStore(message, movieData, jsonData);
    }

    const movieAlreadyInsertedInJSON = jsonData.find(
      (item) => item.text === movieData.title + ' ' + movieData.overview
    );

    if (movieAlreadyInsertedInJSON) {
      message.channel.send(
        `Filme já buscado anteriormente: ${movieData.title}`
      );
      return suposeMovieCategory(message, movieData, jsonData);
    }

    message.channel.send(`Filme novo inserido: ${movieData.title}`);
    suposeMovieCategory(message, movieData, jsonData);

    jsonData.push({
      text: movieData.title + ' ' + movieData.overview,
      category: genreName,
    });

    const json = JSON.stringify(jsonData);

    fs.writeFile('data.json', json, 'utf8', (err) => {
      if (err)
        return message.channel.send(
          `Ops! Ocorreu um erro ao gravar a sinopse :(\n       Erro: ${err}`
        );
    });
  });
};

const tooFewArgumentsInMovieToStore = (message, movieData, jsonData) => {
  message.channel.send(
    `Poucos argumentos na sinopse e nome do filme "${movieData.title}", o mesmo não será usado como futuro parâmetro de busca`
  );
  suposeMovieCategory(message, movieData, jsonData);
};
