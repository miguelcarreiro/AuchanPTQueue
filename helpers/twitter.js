const Twit = require('twit');
const moment = require('moment');

const { twitterKeys } = require('../config/keys');

const twit = new Twit(twitterKeys);

const url = 'https://auchan.queue-it.net/?c=auchan&e=auchan01&t=https%3A%2F%2Fwww.auchan.pt%2FFrontoffice&cid=pt-PT';

moment.locale('pt');

const makeTweet = async (data) => {
  if (data.noQueue) {
    return '🛒⏳ #FilaAuchanPT\n\nNão existe fila neste momento. Boas compras!';
  }

  const initString = 'Tempo de espera estimado para entrar no site:';

  const expectedTime = moment(data.expectedServiceTimeUTC);

  const timeRel = moment(expectedTime).calendar();

  const timeDiff = expectedTime.diff(moment(), 'hours');

  if (timeDiff == 0) {
    const minDiff = expectedTime.diff(moment(), 'minutes');

    return `🛒⏳ #FilaAuchanPT\n\n${initString}\n\n${minDiff} minutos -> ${timeRel}`
  }

  if (timeDiff == 1) {
    return `🛒⏳ #FilaAuchanPT\n\n${initString}\n\n${timeDiff} hora -> ${timeRel}`
  }

  return `🛒⏳ #FilaAuchanPT\n\n${initString}\n\n${timeDiff} horas -> ${timeRel}`;
}

const sendTweet = async (data) => {
  const tweetString = await makeTweet(data);

  try {
    twit.post('statuses/update', { status: tweetString });

  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendTweet,
}