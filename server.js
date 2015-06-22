var http = require('http'), 
	fs = require('fs');

var server = http.createServer( function(req, res) {
    if (req.method == 'POST') {
        console.log("method = POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    } else {
        console.log("method = GET");
        var html = fs.readFileSync('index.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }
});

var port = 3000, 
    host = '127.0.0.1';

server.listen(port, host);

console.log('Listening at http://' + host + ':' + port);