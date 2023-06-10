const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors())
app.use(express.json());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'hilmanrais', // Ganti dengan username MySQL Anda
  password: 'hilmanrais', // Ganti dengan password MySQL Anda
  database: 'crud_produk' // Ganti dengan nama database yang ingin Anda gunakan
});

// Menghubungkan ke MySQL
db.connect((err) => {
  if (err) {
    console.error('Koneksi ke MySQL gagal: ' + err.stack);
    return;
  }
  console.log('Terhubung ke MySQL dengan ID koneksi ' + db.threadId);
});

// Menampilkan daftar produk
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Terjadi kesalahan: ' + err.stack);
      return res.status(500).json({ message: 'Terjadi kesalahan' });
    }
    res.json(results);
  });
});

// Menampilkan detail produk berdasarkan ID
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      console.error('Terjadi kesalahan: ' + err.stack);
      return res.status(500).json({ message: 'Terjadi kesalahan' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json(results[0]);
  });
});

// Menambahkan produk baru
app.post('/products', (req, res) => {
  const { name, price, description } = req.body;
  db.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description], (err, results) => {
    if (err) {
      console.error('Terjadi kesalahan: ' + err.stack);
      return res.status(500).json({ message: 'Terjadi kesalahan' });
    }
    res.json({ id: results.insertId, message: 'Produk berhasil ditambahkan' });
  });
});

// Mengubah data produk berdasarkan ID
app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price, description } = req.body;
  db.query('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?', [name, price, description, productId], (err, results) => {
    if (err) {
      console.error('Terjadi kesalahan: ' + err.stack);
      return res.status(500).json({ message: 'Terjadi kesalahan' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Produk berhasil diubah' });
  });
});

// Menghapus produk berdasarkan ID
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      console.error('Terjadi kesalahan: ' + err.stack);
      return res.status(500).json({ message: 'Terjadi kesalahan' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Produk berhasil dihapus' });
  });
});

// Menjalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
