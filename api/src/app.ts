import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import config from 'config';
import router from './routes/router';
import dbConnection from './database/dbConnection';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/api', router);

const port = config.get<number>('port');

app.listen(port, async () => {
    dbConnection.connect((err: any) => {
        if(err) {
            throw new Error(err.message);
        }

        console. log(`App Running at port ${port}`);
    });
});