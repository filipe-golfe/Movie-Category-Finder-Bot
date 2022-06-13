import axios from 'axios';
import { manageJsonFile } from './manageJsonFile.js';
import { findGenreById } from './findGenreById.js';
import { removeAccentuation } from '../helpers.js';

export const findMovie = (message, prefix) => {
  let movieNameQuery = message.content
    .slice(prefix.length)
    .trimEnd()
    .trimStart()
    .replaceAll(/\s/g, '+');

  movieNameQuery = removeAccentuation(movieNameQuery);

  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.tmdb_token}&query=${movieNameQuery}&language=pt-BR`
    )
    .then(async (response) => {
      if (response.data.total_results === 0) {
        return message.channel.send(
          'Nenhum filme foi encontrado com esse nome!'
        );
      }

      const [movieData] = response.data.results;
      const [genreId] = movieData.genre_ids;
      const genreName = await findGenreById(message, genreId);

      manageJsonFile(message, movieData, genreName);
    })
    .catch((error) => {
      message.channel.send(`Ops! Ocorreu um erro ao buscar o filme: ${error}`);
    });
};
