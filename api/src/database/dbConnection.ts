import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'asksdb',
    database: 'asksdb',
    user: 'root',
    password: 'asksdbpassword' 
});

export default db;