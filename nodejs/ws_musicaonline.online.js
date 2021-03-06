var request = require('request')
var http = require('http')
var url = require('url')
var stringify = require('json-stringify')
var exec = require('child_process').exec;

function getObjectStringList(htmlSource) {
  var inicio = 'var playlist'
  var fin = ');'
  var str = htmlSource
  inicio = str.lastIndexOf(inicio)
  fin = str.indexOf(fin, inicio) + fin.length
  var objetoHTML = str.substring(inicio, fin)
  return objetoHTML
}

var download_file_wget = function(file_url, file_name, DOWNLOAD_DIR) {
  // extract the file name
  var file_name_url = url.parse(file_url).pathname.split('/').pop()
    // compose the wget command
  var extension = 'mp3'
  if (file_name_url.toLowerCase().indexOf('.msa') > -1) {
    extension = 'msa'
  }
  var command = 'mkdir -p "' + DOWNLOAD_DIR + '"; wget "' + file_url + '" -O "' + DOWNLOAD_DIR + '/' + file_name + '.' + extension + '"'
  console.log('\n' + command)
    // excute wget using child_process' exec function

  var child = exec(command, function(err, stdout, stderr) {
    if (err) {
      //throw err
      console.log("Error wget:", err)
    } else {
      console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR)
    }
  })
}

//para acceder: localhost:9999/?enlace=
console.log('Escuchando...  curl "http://localhost:9999/?url=http://www.musicaonline.online/de-moda.com"')
http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  var url_parts = url.parse(req.url, true)
  var query = url_parts.query
  console.log(query)

  if (!query.url) {
    res.end('Escriba algo como http://localhost:9999/?url=http://www.musicaonline.online/de-moda.com')
  }

  request.get({
    url: query.url,
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body)
      var list = getObjectStringList(body)

      function jPlayerPlaylist(objeto, lista) {
        return lista
      }

      eval(list) //;console.log(playlist)

      res.end(stringify(playlist, null, 2, {
        offset: 2
      }))

      var DOWNLOAD_DIR = 'songs'
      for (var i = 0; i < playlist.length; i++) {
        var DOWNLOAD_DIR_ESPECIFIC = DOWNLOAD_DIR + '/' + playlist[i].genero + '/' + playlist[i].artista
        download_file_wget(playlist[i].mp3, playlist[i].title, DOWNLOAD_DIR_ESPECIFIC)
      }

    } else {
      console.log('Error :', error)
    }
  })

}).listen(9999)
