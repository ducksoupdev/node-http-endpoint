var http = require('http'), 
	fs = require('fs');

function formatRequest(body) {
    var params = body.split("&");
    var paramsObj = {};
    params.forEach(function(param) {
        var keyValues = param.split("=");
        paramsObj[keyValues[0]] = keyValues[1];
    });
    console.log(paramsObj);

    return paramsObj;
}

var server = http.createServer( function(req, res) {
    if (req.method === 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            var data = formatRequest(body);
            if (/start/.test(req.url)) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Game started: ' + JSON.stringify(data));
                console.log('Game started: ' + JSON.stringify(data));
            } else if (/move/.test(req.url)) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Post received: ' + JSON.stringify(data));
                console.log('Post received: ' + JSON.stringify(data));
            } else {
                res.writeHead(403, {'Content-Type': 'text/plain'});
            }
        });
    } else if (req.method === 'GET' && /move/.test(req.url)) {
        // var moves = ['ROCK', 'PAPER', 'SCISSORS', 'DYNAMITE', 'WATERBOMB'];
        var moves = ['ROCK', 'PAPER', 'SCISSORS'];
        var move = moves[Math.floor(Math.random() * moves.length)];
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(move);
        console.log('My move: ' + move);
    } else {
        res.writeHead(403, {'Content-Type': 'text/plain'});
    }
});

var port = 3000, 
    host = '0.0.0.0';

server.listen(port, host);

console.log('Listening at http://' + host + ':' + port);