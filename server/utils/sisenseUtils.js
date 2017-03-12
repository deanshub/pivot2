const request = require('request')

function getRevisionId(baseUrl, datasource, token) {
  return new Promise(function(resolve, reject){
    request.get(`${baseUrl}/api/datasources/${datasource.fullname}/revision`,
      {
        headers: {
          'Authorization': token,
        },
      }, function (error, response, body) {
        if (error) {
          return reject(error)
        }

        resolve(body)
      })
  })
}

module.exports = {
  getRevisionId,
}
