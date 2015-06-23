var http = require('http'), 
	fs = require('fs');

function Game(name, pointsToWin, maxRounds, dynamiteCount) {
    this.opponentName = name;
    this.pointsToWin = pointsToWin;
    this.maxRounds = maxRounds;
    this.dynamiteCount = dynamiteCount;
    this.moves = [];
    this.ourMoves = [];
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

var winners = {
    'ROCK': 'PAPER',
    'PAPER': 'SCISSORS',
    'SCISSORS': 'ROCK',
    'DYNAMITE': 'WATERBOMB',
    'WATERBOMB': 'ROCK'
}

var isLastFiveTheSame = function() {
    if (currentGame.moves.length < 6) {
        return null;
    }
    
    var lastSixMoves = currentGame.moves.slice(currentGame.moves.length - 6, currentGame.moves.length);
    
    if (lastSixMoves[0] === lastSixMoves[3] &&
        lastSixMoves[1] === lastSixMoves[4] &&
        lastSixMoves[2] === lastSixMoves[5]) {
            return winners[lastSixMoves[0]];
    }
    
    return null;
};

var getMove = function() {
    var move = "ROCK";
    var gameLength = currentGame.moves.length;
    
    if (gameLength > 0) {
        console.log('We have moves!');
        
        var lastMove = isLastFiveTheSame();
        if (lastMove) {
            console.log('last five are the same - returning: ' + lastMove);
            return lastMove;
        }
        
        if (currentGame.moves[gameLength -1] === currentGame.ourMoves[currentGame.ourMoves.length - 1] &&
            currentGame.dynamiteCount > 0) {
            move = 'DYNAMITE';
            currentGame.dynamiteCount--;
        } else if (gameLength > 1 && 
                    currentGame.moves[gameLength -1] === "DYNAMITE" &&
                    currentGame.moves[gameLength -2] === "DYNAMITE") {
            move = 'WATERBOMB';
        }
    }
 
    return move;
};

var currentGame = null,
    roundCount = 0;

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
            res.writeHead(200, {'Content-Type': 'text/plain'});
            var move = getMove();
            currentGame.ourMoves.push(move);
            console.log('Move: ' + move);

            res.end(move);

        }    
        
    }
});

var port = 80, 
    host = '0.0.0.0';

server.listen(port, host);

console.log('Listening at http://' + host + ':' + port);