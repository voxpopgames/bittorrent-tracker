var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var Server = require("bittorrent-tracker").Server;

var server = new Server({
  udp: true,
  ws: true,
  stats: true,
  filter: function(infoHash, params, cb) {
    let allowed = true;
    console.log("infohash", infoHash);
    console.log("params", params);
    //console.log("peer_id: ", params.peer_id);

    if (allowed) {
      cb(null);
    } else {
      cb(new Error("disallowed torrent"));
    }
  }
});

server.on("start", function(addr) {
  console.log("got start message from " + addr);
});

server.on("complete", function(addr) {
  console.log("got complete message from " + addr);
});
server.on("update", function(addr) {
  console.log("got update message from " + addr);
});
server.on("stop", function(addr) {
  console.log("got stop message from " + addr);
});

// server.on("error", function(err) {
//   console.log("There was an error: ", err);
//   console.log("error: " + err.message);
// });

server.on("error", (err) => {
  console.log("There was an error: ", err);
  console.log("error: " + err.message);
});

// server.on('warning', function (err) {
//   console.log("warning: " + err.message)
// })

server.on('warning', (err) => {
  console.log("warning: " + err.message)
})

app.get('/', (req, res, next) => {
  console.log('get route', req.testing);
  res.send("<h1>You've made it to the regular landing page!</h1>")
  //res.end();
});

app.ws('/', (ws, req) => {
  console.log("inside websocket func: ");
  server.onWebSocketConnection(ws);
});

// const onHttpRequest = server.onHttpRequest.bind(server)
// app.get('/announce', onHttpRequest)
// app.get('/scrape', onHttpRequest)

const onHttpRequest = server.onHttpRequest.bind(server)
app.ws('/announce', onHttpRequest)
app.ws('/scrape', onHttpRequest)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("app is listening on port: "+PORT));
