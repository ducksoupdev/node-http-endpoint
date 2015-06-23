var request = require('superagent');

// var server = 'http://172.26.53.116';
var server = 'http://localhost';

var games = [
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'PAPER' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
    { method: 'post', url: '/move', params: { lastOpponentMove: 'ROCK' } },
    { method: 'get', url: '/move', params: null, expects: 'ROCK' },
];

request
    .post(server + '/start')
    .type('form')
    .send({
        opponentName: 'Bob',
        pointsToWin: 1000,
        maxRounds: 1000,
        dynamiteCount: 3
    })
    .end(function (err, res) {
        // console.log(res.text);
    });


games.forEach(function (game) {
    if (game.method === 'post') {
        
        request
            .post(server + game.url)
            .type('form')
            .send(game.params)
            .end(function (err, res) {
            // console.log(res.text);
        });
    } else if (game.method === 'get') {
        request
            .get(server + game.url)
            .end(function (err, res) {
            console.log('opponent: ' + game.params.lastOpponentMove);
            console.log(res.text);
            console.log(res.text + ' equals ' + game.expects + ': ' + res.text === game.expects);
        });
    }
});