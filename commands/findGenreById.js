import axios from 'axios';

export const findGenreById = async (message, id) => {
  return await axios
    .get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.tmdb_token}&language=pt-br`
    )
    .then((response) => {
      const genres = response.data.genres;
      const genre = genres.find((genre) => genre.id === id);

      return genre ? genre.name : 'Não definida';
    })
    .catch((error) => {
      message.channel.send(
        `Ops! Ocorreu um erro ao buscar o gênero do filme: ${error}`
      );
    });
};
