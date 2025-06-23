import express from 'express';
import {
  getJoyas,
  getJoyasConFiltros
} from '../controllers/joyas.controller.js';

const router = express.Router();

router.get('/', getJoyas); 
router.get('/filtros', getJoyasConFiltros); 

export default router;


