const http = require('http');
const nodestatic = require('node-static');
const file = new nodestatic.Server('./dist/');
const server = http.createServer();

const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

server.on('request', (req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});
server.on('upgrade', function (request, socket, head) {
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const port = 3210;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
