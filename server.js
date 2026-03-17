const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Auto-Create Admin Logic
async function createAdmin() {
    const email = 'bindhanibikash71@gmail.com';
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash('Bikash@1430', 10);
        await db.execute(
            'INSERT INTO users (name, email, password, role, balance) VALUES (?, ?, ?, ?, ?)',
            ['Bikash Bindhani', email, hashedPassword, 'admin', 0.00]
        );
        console.log("Admin account created successfully.");
    }
}

// Routes setup (simplified for brevity)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await createAdmin();
});
