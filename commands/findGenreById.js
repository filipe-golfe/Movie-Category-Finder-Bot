import axios from 'axios';

export const findGenreById = async (message, id) => {
  await axios
    .get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.tmdb_token}&language=pt-br`
    )
    .then(async function (response) {
      const genres = response.data.genres;
      const genre = await genres.find((genre) => genre.id === id);
      return genre.name;
    })
    .catch(function (error) {
      message.channel.send(
        `Ops! Ocorreu um erro ao buscar o gênero do filme: ${error}`
      );
    });
};
