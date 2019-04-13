const https = require('https')
const fs    = require('fs');
const async = require('async');

if(process.argv.length != 3) {
    console.log('Please provide a text file');
    process.exit(0);
}

run(process.argv[2]);

function run(file) {
    var output = '';

    var input = fs.readFileSync(file, 'utf8');
    var text = input.split(' ');
    var params = [];
    var i = 0;

    for(i = 0; i < text.length; i++)
        params.push(replace_word(text[i], i, text));

    Promise.all(params).then(function(data) {
        console.log(text.join(' '));
    });
}

function replace_word(word, i, text) {
    return new Promise((resolve, reject) => {
        get_synonyms(word, function(err, syns) {
            if(err == 0) {
                var synonyms = null;
            
                if(syns.adjective != undefined && syns.adjective.syn != undefined)
                    synonyms = syns.adjective.syn;
                else if(syns.noun != undefined && syns.noun.sim != undefined)
                    synonyms = syns.noun.sim;

                if(synonyms != null) {
                    var longest = '';

                    synonyms.forEach(syn => {
                        if(syn.length > longest.length)
                            longest = syn;
                    });

                    text[i] = longest;
                }

                resolve();
            } else if(err == 2)
                reject();
            else
                resolve();
        });
    });
}

function get_synonyms(word, callback) {
    https.get(`https://words.bighugelabs.com/api/2/e56e46db9dbbb203ece79ab27cae9641/${word}/json`, (res) => {
        let data = '';
    
        res.on('data', (d) => {
            data += d;
        });

        res.on('end', () => {
            try {
                var json = JSON.parse(data);
                callback(0, json);
            } catch(err) {
                callback(1);
            }
        });
    }).on("error", (err) => {
        callback(2);
    });
}