var http = require('http'), 
	fs = require('fs');

function Game(name, pointsToWin, maxRounds, dynamiteCount) {
    this.opponentName = name;
    this.pointsToWin = pointsToWin;
    this.maxRounds = maxRounds;
    this.dynamiteCount = dynamiteCount;
    this.moves = [];
}

var formatRequest = function(body) {
    var params = body.split("&");
    var paramsObj = {};
    params.forEach(function(param) {
        var keyValues = param.split("=");
        paramsObj[keyValues[0]] = keyValues[1];
    });
    console.log(paramsObj);

    return paramsObj;
};

var getMove = function() {
    var move = "ROCK";
    if (currentGame.moves.length > 0 &&
        currentGame.moves[currentGame.moves.length -1] === 'ROCK' &&
        currentGame.dynamiteCount > 0) {
        move = 'DYNAMITE';
        currentGame.dynamiteCount--;
    } 
    return move;
};

var currentGame = null;


var server = http.createServer( function(req, res) {
    if (req.method == 'POST') {
        console.log("method = POST");


        var body = '';


        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var data = formatRequest(body);
            if (/start/.test(req.url)) {
                console.log('current game');
                console.log(currentGame);
                if (currentGame) {
                    console.log('Writing previous game');
                    fs.writeFileSync('./games/' + currentGame.opponentName + '-' + new Date().toJSON(), JSON.stringify(currentGame));
                }
                currentGame = new Game(data.opponentName, data.pointsToWin, data.maxRounds, data.dynamiteCount);
            }
            else if (/move/.test(req.url)) {
                console.log('Opponent Move');
                console.log(data.lastOpponentMove);
                currentGame.moves.push(data.lastOpponentMove);
            }

        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    } else if (req.method === 'GET') {
        console.log("method = GET");

        if (/move/.test(req.url)) {
            console.log("Move");    

            res.writeHead(200, {'Content-Type': 'text/plain'});
            var move = getMove();

            res.end(move);

        }    
        
    }
});

var port = 80, 
    host = '0.0.0.0';

server.listen(port, host);

console.log('Listening at http://' + host + ':' + port);