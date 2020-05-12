import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import uploadConfid from './config/upload';

import './database';

const app = express();
app.use(express.json());

app.use(cors({}));
app.get('/cadas', (req, res) => {
  res.send();
});
app.use('/files', express.static(uploadConfid.dirName));
app.use(routes);

app.listen(3335, () => {
  console.log('Server started on port 3335');
});
