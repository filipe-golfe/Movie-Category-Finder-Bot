import brain from 'brain.js';
import fs from 'fs';

export const suposeMovieCategory = (message, movieData, jsonData) => {
  const networkPath = 'data-cached.json';
  // const networkPath = '03_hardware-software-cached.network.json';

  const trainingData = jsonData.map((item) => ({
    input: item.text,
    output: item.category,
  }));

  const network = new brain.recurrent.LSTM();
  let networkData = null;
  if (fs.existsSync(networkPath)) {
    networkData = JSON.parse(fs.readFileSync(networkPath));
    network.fromJSON(networkData);
  } else {
    network.train(trainingData, {
      iterations: 2000,
    });
    fs.writeFileSync(networkPath, JSON.stringify(network.toJSON(), null, 2));
  }

  // const output = network.run(`${movieData.title} ${movieData.overview}`);
  const output = network.run(
    'Os Dez Mandamentos: O Filme Com efeitos especiais grandiosos e uma história emocionante, o filme produzido pela Record conta uma das mais famosas passagens da Bíblia: a saga de Moisés, desde seu nascimento até a chegada de seu povo à Terra Prometida, passando pela fuga do Egito através do Mar Vermelho e o encontro com Deus no Monte Sinai. Livre adaptação dos livros Êxodo, Levítico, Números e Deuteronômio, o filme cobre mais de cem anos de história, em tramas recheadas de emoção.'
  );

  message.channel.send(`Categoria: ${output}`);
};
