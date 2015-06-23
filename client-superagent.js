var request = require('superagent');

var server = 'http://172.26.53.116';

var games = [
    { method: 'post', url: '/start', params: { opponentName: 'Bob' } },
    { method: 'post', url: '', params: {} },
    { method: 'get', url: '', params: '' },
];

games.forEach(function (game) {
    if (game.method === 'post') {
        request
            .post(server + game.url)
            .type('form')
            .send(game.params)
            .end(function (err, res) {
                console.log(res.text);
            });
    } else if (game.method === 'get') {
        request
            .get(server + game.url + '?' + game.params)
            .end(function (err, res) {
                console.log(res.text);
            });
    }
});