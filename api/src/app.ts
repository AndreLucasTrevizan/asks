import express from 'express';
import cors from 'cors';
import config from 'config';
import router from './routes/router';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

const port = config.get<number>('port');

app.listen(port, () => {
    console.log(`Running at port ${port}`);
});