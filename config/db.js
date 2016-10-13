exports.config = {
  user: 'iiungyymhozhtp',
  database: 'd59eiet9pi889o',
  password: '',
  host: 'ec2-54-243-249-165.compute-1.amazonaws.com',
  port: 5432
};

exports.executaTransacao = function(objetoListaSelect) {
    return new Promise(function(resolve, reject) {
      objetoListaSelect[0].conn.connect(function (err) {
        console.log('Abre Conexão');
        if (err) {
          console.log(err);
          throw err;
        }
        Promise.all(objetoListaSelect.map(queryPromise))
        .then(function(results) {
          objetoListaSelect[0].conn.end(function (err) {
            console.log('Fechar Conexão!');
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(results);
          });
        });
      });
    });
};

function queryPromise(obj) {
    return new Promise(function(resolve, reject) {
        obj.conn.query(obj.select, obj.params, function(err, result) {
            console.log('Executa Query: '+obj.select);
            console.log('Parametros: '+obj.params);
            if (err) {
              console.log(err);
              reject(err);  
            } 
            resolve(result);            
        });
    });
}