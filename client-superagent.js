var request = require('superagent');

request
    .post('http://localhost:3000/')
    .type('form')
    .send({ name: 'Hello world!' })
    .end(function (err, res) {
    if (res.ok) {
        console.log(res.text);
    } else {
        console.error('Oh no! error ' + res.text);
    }
});