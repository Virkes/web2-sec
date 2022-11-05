const express = require('express');
var path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const client = new Client({
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: 5432,
  connectionString: process.env.DB_CONNECTION,
  ssl: true
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;


app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

if (externalUrl) {
  const hostname = '127.0.0.1';
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
    outside on ${externalUrl}`);
  });
}
else {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
    }, app)
    .listen(port, function () {
    console.log(`Server running at https://localhost:${port}/`);
    });
}

client
  .connect()
  .then(() => console.log('connected'))
  .catch(err => console.error('connection error', err.stack))

app.get("/", (req, res) => {
  res.render('index')
});

app.get('/secure', (req, res) => {
  res.render('secure')
});

app.post("/grades-unsecure", (req, res) => {
  const data = req.body;
  const query = `SELECT * FROM Ocjena WHERE studentId = (${data.studentId})`;
  try {
    client.query(query, (err, result) => {
      if(err) throw err;
      res.render('grades-unsecure', {data: result.rows});
    });
  } catch (err) {
    res.send('Something went wrong!');
  }
});

app.post("/grades-secure", (req, res) => {
  const studentId = req.body.studentId;
  if (typeof Number(studentId) != "number") {
    res.send("Invalid parameters!");
    res.end();
    return;
  }
  if (studentId) {
    try {
      client.query("SELECT * FROM Ocjena WHERE studentId = $1", [studentId],
      (err, result) => {
        if(err) throw err;
        res.render('grades-secure', {data: result.rows});
      });
    } catch (err) {
      res.send('Something went wrong!');
    }
  }
});

app.get("/grade-unsecure", (req, res) => {
  const subject = req.query.subject;
  const test = req.query.test;
  const grade = req.query.grade;
  const studentId = req.query.studentId;
  try {
    client.query("INSERT INTO Ocjena(test, subject, grade, studentId) VALUES ($1, $2, $3, $4)",
      [test, subject, grade, studentId], (err, result) => {
    if(err) throw err;
    console.log(req.query);
    res.render('index');
  });
  } catch (err) {
    res.send('Something went wrong!');
  }
});

app.post("/grade-secure", (req, res) => {
  const subject = req.body.subject;
  const test = req.body.test;
  const grade = req.body.grade;
  const studentId = req.body.studentId;
  const query = `INSERT INTO Ocjena(test, subject, grade, studentId) VALUES ($1, $2, $3, $4)`;
  try {
    client.query(query, [test, subject, grade, studentId], (err, result) => {
      if(err) throw err;
      res.render('secure');
    });
  } catch (err) {
    res.send('Something went wrong!');
  }
});

module.exports = app;
