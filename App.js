const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Jose2510',
      database: 'mi_base_de_datos'
    });
    console.log('Conectado a la base de datos MySQL');
    return connection;
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
}

let dbConnection;

connectToDatabase().then(connection => {
  dbConnection = connection;
}).catch(err => {
  console.error('Error al establecer la conexión a la base de datos:', err);
});

app.post('/register', async (req, res) => {
  const { id, firstName, lastName, username, password } = req.body;

  const sql = 'INSERT INTO usuarios (id, nombre, apellido, usuario, contrasena) VALUES (?, ?, ?, ?, ?)';
  try {
    const [result] = await dbConnection.execute(sql, [id, firstName, lastName, username, password]);
    res.send('Usuario registrado exitosamente');
  } catch (err) {
    console.error('Error al insertar en la base de datos:', err);
    res.status(500).send('Error al registrar el usuario');
  }
});

app.listen(3000, () => {
  console.log('Servidor API escuchando en el puerto 3000');
});
