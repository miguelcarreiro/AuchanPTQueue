const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://auchan.queue-it.net/?c=auchan&e=auchan01&t=https%3A%2F%2Fwww.auchan.pt%2FFrontoffice&cid=pt-PT';

const getExpServiceTime = async () => {
  try {
    const page = await axios.get(url);
    const $ = cheerio.load(page.data);

    if ($('title').text() != 'Queue-it') {
      return {
        noQueue: true,
      }
    }

    const scriptText = $('script')[7].children[0].data;

    const startStr = 'inqueueInfo: ';

    const firstPos = scriptText.indexOf(startStr) + startStr.length;
    const strOnlyVar = scriptText.slice(firstPos, -660);

    const lastPos = strOnlyVar.lastIndexOf('}') + 1;

    const filteredStr = strOnlyVar.slice(0, lastPos).replace(/'/g, '"');

    const auchanJson = JSON.parse(filteredStr);

    return auchanJson.ticket;

  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getExpServiceTime,
}