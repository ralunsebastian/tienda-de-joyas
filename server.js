import express from 'express';
import 'dotenv/config';
import joyasRoutes from './routes/joyas.routes.js';
import logger from './middlewares/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger); // middleware personalizado
app.use('/joyas', joyasRoutes); // rutas

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
