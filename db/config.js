import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  allowExitOnIdle: true,
});

// Verificar conexión
pool.query('SELECT NOW()')
  .then(res => console.log('✅ Conectado a la BD:', res.rows[0]))
  .catch(err => console.error('❌ Error al conectar a la BD:', err));

export default pool;
