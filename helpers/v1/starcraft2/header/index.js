const sc2playerApi = require('../../../../api/v1/starcraft2/player');

const formatHeaderData = data => ({
  player: {
    server: data.server,
    name: data.displayName,
    clan: {
      name: data.clanName || '',
      tag: data.clanTag || '',
    },
    rank: data.career.highest1v1Rank || '',
    portrait: {
      x: typeof data.portrait !== 'undefined' ? data.portrait.x : '',
      y: typeof data.portrait !== 'undefined' ? data.portrait.y : '',
      w: typeof data.portrait !== 'undefined' ? data.portrait.w : '',
      h: typeof data.portrait !== 'undefined' ? data.portrait.h : '',
      offset: typeof data.portrait !== 'undefined' ? data.portrait.offset : '',
      url: typeof data.portrait !== 'undefined' ? data.portrait.url : '',
    },
  },
});

const getHeaderData = async player => sc2playerApi.getPlayerProfile(player)
  .then((data) => {
    const playerServer = player.server;
    const playerData = data;
    playerData.server = playerServer;
    return formatHeaderData(data);
  })
  .catch(error => error);

module.exports = {
  getHeaderData,
};