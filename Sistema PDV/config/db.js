var pg = require('pg');
var config = {
  user: '',
  database: '',
  password: '',
  host: '',
  port: 5432,
  max: 5,
  idleTimeoutMillis: 30000,
  ssl: true
};

var pool = new pg.Pool(config);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
});

exports.executaTransacao = function(objetoListaSelect) {
    return new Promise(function(resolve, reject) {
        pool.connect(function(err) {
            if (err) {
              return reject(err);
            }
            Promise.all(objetoListaSelect.map(queryPromise))
            .then(function(results) {
                console.log(JSON.stringify(results));
                if (err) {
                    console.log('Error 2');
                    reject(err);
                }
                resolve(results);
            });
        });
    });
};

function queryPromise(obj) {
    return new Promise(function(resolve, reject) {
        console.log(obj.select);
        console.log(obj.params);
        pool.query(obj.select, obj.params, function(err, result) {
            if (err) {
                reject(err);  
            } 
            resolve(result.rows);            
        });
    });
}