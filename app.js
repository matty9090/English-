const https = require('https')

const options = {
    hostname: 'words.bighugelabs.com',
    port: 443,
    path: '/api/2/e56e46db9dbbb203ece79ab27cae9641/word/json',
    method: 'GET'
}

console.log(process.argv);

const req = https.request(options, (res) => {
    res.on('data', (d) => {
        var json = JSON.parse(d);

        console.log(json.noun.syn);
    });
});

req.on('error', (error) => {
    console.error(error);
})

req.end();