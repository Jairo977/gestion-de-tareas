const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Importa el middleware CORS
const app = express();

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Wladys*_1997',
  database: 'gestion_tareas1'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tareas';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/tasks', (req, res) => {
  const { titulo, descripcion } = req.body;
  const sql = 'INSERT INTO tareas (titulo, descripcion) VALUES (?, ?)';
  db.query(sql, [titulo, descripcion], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, titulo, descripcion });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const sql = 'UPDATE tareas SET titulo = ?, descripcion = ? WHERE id = ?';
  db.query(sql, [titulo, descripcion, id], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Task updated successfully!' });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tareas WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Task deleted successfully!' });
  });
});
