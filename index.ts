
import express, { Request, Response, Application } from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import taskRoutes from './routes/task';

const app: Application = express();
const port = process.env.PORT || 8000;


// Use bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});


// Mount the taskRoutes under the '/api' path
app.use('/api', taskRoutes);


// Create HTTP server.
const server = http.createServer(app);

server.listen(port);

server.on('error', function (error) {
  console.log(error);
});

server.on('listening', function () {
  const addr: any = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.debug('Listening on ' + bind);
});

export { app };