const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
const puerto = 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'likeme',
  allowExitOnIdle: true
});

// Ruta para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los posts');
  }
});

// Ruta para insertar un nuevo post
app.post('/posts', async (req, res) => {
  try {
    const { titulo, img, descripcion, likes } = req.body;
    // Asigna un valor inicial de 0 para likes si no se proporciona
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, img || '', descripcion, likes || 0]
    );
    res.status(201).json({ message: 'Post creado con éxito', postId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear un nuevo post');
  }
});


// Ruta para dar like a un post
app.put('/posts/like/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes', [postId]);
    
    if (result.rowCount === 0) {
      // Si no se encontró un post con el ID proporcionado
      console.log(`Post no encontrado con ID: ${postId}`);
      res.status(404).json({ message: 'Post no encontrado' });
      return;
    }

    const updatedLikes = result.rows[0].likes;
    console.log(`Like registrado con éxito para el post ID: ${postId}, Likes actualizados: ${updatedLikes}`);
    res.json({ message: 'Like registrado con éxito', postId, likes: updatedLikes });
  } catch (err) {
    console.error('Error al dar like:', err);
    res.status(500).send('Error al registrar el like');
  }
});


// Ruta para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ message: 'Post eliminado con éxito', postId });
  } catch (err) {
    console.error('Error al eliminar el post:', err);
    res.status(500).send('Error al eliminar el post');
  }
});

app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
