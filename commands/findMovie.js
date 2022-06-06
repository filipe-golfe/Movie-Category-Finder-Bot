import axios from 'axios';
import { findMovieCategory } from './findMovieCategory.js';
import { findGenreById } from './findGenreById.js';
import { removeAccentuation } from '../helpers.js';

export const findMovie = async (message, prefix) => {
  let movieNameQuery = message.content
    .slice(prefix.length)
    .trimEnd()
    .trimStart()
    .replaceAll(/\s/g, '+');

  movieNameQuery = removeAccentuation(movieNameQuery);

  await axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.tmdb_token}&query=${movieNameQuery}&language=pt-BR`
    )
    .then(async function (response) {
      if (response.data.total_results === 0) {
        return message.channel.send(
          'Nenhum filme foi encontrado com esse nome!'
        );
      }

      const [movieData] = response.data.results;
      const [genreId] = movieData.genre_ids;

      const genreName = await findGenreById(message, genreId);
      console.log(genreName);
      // findMovieCategory(message, movieData);
    })
    .catch(function (error) {
      message.channel.send(`Ops! Ocorreu um erro ao buscar o filme: ${error}`);
    });
};
