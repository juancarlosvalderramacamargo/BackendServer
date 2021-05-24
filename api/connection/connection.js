const mysql = require('mysql');


const mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password : '',
    database:'db_angular_claro'
});

mysqlConnection.connect(err => {
    if (err) {
        console.log('Error conectando bd: ',err);
        return;
    } else {
        console.log('Database server running!');
    }
});

module.exports = mysqlConnection;