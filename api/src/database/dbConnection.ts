import mysql from 'mysql2';
import config from 'config';

export default mysql.createConnection({
    host: config.get<string>('db_host'),
    database: config.get<string>('db_database'),
    user: config.get<string>('db_user'),
    password: config.get<string>('db_password') 
});