import mysql from 'mysql2';

export default mysql.createConnection({
    host: 'asksdatabase',
    database: 'asksdb',
    user: 'root',
    password: 'asksdbpassword' 
});