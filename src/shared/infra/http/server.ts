import 'reflect-metadata';
import { errors } from 'celebrate';
import express from 'express';
import cors from 'cors';
import uploadConfid from '@config/upload';
import routes from './routes';
import '@shared/container';

import '@shared/infra/typeorm';

const app = express();
app.use(express.json());

app.use(cors({}));
app.get('/cadas', (req, res) => {
  res.send();
});
app.use('/files', express.static(uploadConfid.uploadFolder));
app.use(routes);

app.use(errors());

const port = 3333;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
