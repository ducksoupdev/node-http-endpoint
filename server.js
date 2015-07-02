var http = require('http'), 
	fs = require('fs');

function Game(name, pointsToWin, maxRounds, dynamiteCount) {
    this.opponentName = name;
    this.pointsToWin = pointsToWin;
    this.maxRounds = maxRounds;
    this.dynamiteCount = dynamiteCount;
    this.moves = [];
    this.ourMoves = [];
    this.playCount = {
        "ROCK": 0,
        "SCISSORS": 0,
        "PAPER": 0,
        "DYNAMITE": 0,
        "WATERBOMB": 0
    };
    this.doesDoubleDyno = false;
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
};

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

var getMostFrequentWinner = function() {
    var mostFrequent = null;
    for (var key in currentGame.playCount) {
        if (key !== "DYNAMITE" && key !== "WATERBOMB") {
            if (!mostFrequent) {
                mostFrequent = key;
            }
            if (currentGame.playCount[key] > currentGame.playCount[mostFrequent]) {
                mostFrequent = key;
            }    
        }
    }
    console.log("Most Frequent");
    console.log(mostFrequent);
    return winners[mostFrequent];
};

var getMove = function() {
    var move = "SCISSORS";
    var gameLength;
    if (currentGame) {
        gameLength = currentGame.moves.length;    
    }else {
        gameLength = 0;
    }
    
    
    if (gameLength > 0) {
        console.log('We have moves!');
        
        var lastMove = isLastFiveTheSame();
        if (lastMove) {
            console.log('last five are the same - returning: ' + lastMove);
            return lastMove;
        }
        
        if (currentGame.moves[gameLength -1] === currentGame.ourMoves[currentGame.ourMoves.length - 1]) {
            if (ourLast === "DYNAMITE") {
                if (currentGame.doesDoubleDyno) {
                    move = 'WATERBOMB'    
                }
                else {
                    move = getMostFrequentWinner();
                }
                
            }
            else if (currentGame.dynamiteCount > 0) {
                move = 'DYNAMITE';
                currentGame.dynamiteCount--;    
            } else {
                move = winners[ourLast];
            }

            
        } else if (gameLength > 1 && 
                    currentGame.moves[gameLength -1] === "DYNAMITE" &&
                    currentGame.moves[gameLength -2] === "DYNAMITE" &&
                    currentGame.moves[gameLength -3] === "DYNAMITE") {
            move = 'WATERBOMB';
        } else {
            move = getMostFrequentWinner();    
        }
        
    }
 
    return move;
};

var currentGame = null,
    roundCount = 0,
    ourLast = null,
    theirLast = null;

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
                if (theirLast === "DYNAMITE" && data.lastOpponentMove === "DYNAMITE") {
                    currentGame.doesDoubleDyno = true;
                }
                currentGame.playCount[data.lastOpponentMove]++;
                theirLast = data.lastOpponentMove;
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
            ourLast = move;
            console.log('Move: ' + move);

            res.end(move);

        }    
        
    }
});

var port = 80, 
    host = '0.0.0.0';

server.listen(port, host);

console.log('Listening at http://' + host + ':' + port);