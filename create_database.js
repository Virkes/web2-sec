const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'Student_grades',
    password: process.env.DB_PASSWORD,
    port: 5432,
    connectionString: process.env.DB_CONNECTION,
    ssl: true
});

client
  .connect()
  .then(() => console.log('connected'))
  .catch(err => console.error('connection error', err.stack))

const sql = `CREATE TABLE Ocjena(
    id SERIAL PRIMARY KEY,
    test varchar(50) NOT NULL,
    subject varchar(50) NOT NULL,
    grade int NOT NULL,
    studentId int NOT NULL
);`;

// client.query(sql, (err, res) => {
//     if(err) {
//         console.error(err);
//         return;
//     }
//     console.log('Table created')
//     client.end();
// });

const sql2 = `INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('||. svjetski rat', 'Povijest', 4, 1);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('||. svjetski rat', 'Povijest', 2, 2);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('||. svjetski rat', 'Povijest', 4, 3);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Glasovne promjene', 'Hrvatski', 3, 1);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Glasovne promjene', 'Hrvatski', 5, 2);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Glasovne promjene', 'Hrvatski', 5, 3);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Krebsov ciklus', 'Biologija', 4, 1);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Krebsov ciklus', 'Biologija', 3, 2);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Krebsov ciklus', 'Biologija', 4, 3);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Neutralizacija', 'Kemija', 3, 1);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Neutralizacija', 'Kemija', 5, 2);
    INSERT INTO
    Ocjena(test, subject, grade, studentId)
    VALUES ('Neutralizacija', 'Kemija', 3, 3);
`;

// client.connect();
client.query(sql2, (err, res) => {
    console.log(err, res);
});