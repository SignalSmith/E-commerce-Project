const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();

const dbPath = path.join(__dirname, '..', 'src', 'app', 'db.json');

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`JSON Server is running on port ${PORT}`);
});