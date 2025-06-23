import pool from '../db/config.js';
import buildHATEOAS from '../utils/hateoas.js';

export const getJoyas = async (req, res) => {
  try {
    console.log('Inicio getJoyas');

    const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query;
    const limitsNum = parseInt(limits);
    const pageNum = parseInt(page);

    const [campo, direccion] = order_by.split('_');
    const offset = (pageNum - 1) * limitsNum;

    console.log({ limitsNum, pageNum, campo, direccion, offset });

    // Consulta total
    const totalResult = await pool.query('SELECT COUNT(*) FROM inventario');
    const total = parseInt(totalResult.rows[0].count);
    console.log('Total joyas:', total);

    // Consulta paginada
    const query = `SELECT * FROM inventario ORDER BY ${campo} ${direccion} LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [limitsNum, offset]);

    const joyas = result.rows;
    console.log('Joyas obtenidas:', joyas.length);

    const resultadoHATEOAS = buildHATEOAS({
      items: joyas,
      page: pageNum,
      limit: limitsNum,
      total,
      baseUrl: `${req.protocol}://${req.get('host')}${req.path}`,
      query: req.query
    });

    console.log('Respuesta lista, enviando...');
    res.json(resultadoHATEOAS);
    console.log('Respuesta enviada');
  } catch (error) {
    console.error('Error en GET /joyas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const getJoyasConFiltros = async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    const filtros = [];
    const values = [];

    // Validaciones básicas para proteger aún más
    if (precio_min) {
      if (isNaN(precio_min)) {
        return res.status(400).json({ error: 'precio_min debe ser un número' });
      }
      values.push(Number(precio_min));
      filtros.push(`precio >= $${values.length}`);
    }

    if (precio_max) {
      if (isNaN(precio_max)) {
        return res.status(400).json({ error: 'precio_max debe ser un número' });
      }
      values.push(Number(precio_max));
      filtros.push(`precio <= $${values.length}`);
    }

    if (categoria) {
      if (typeof categoria !== 'string') {
        return res.status(400).json({ error: 'categoria debe ser texto' });
      }
      values.push(categoria);
      filtros.push(`categoria = $${values.length}`);
    }

    if (metal) {
      if (typeof metal !== 'string') {
        return res.status(400).json({ error: 'metal debe ser texto' });
      }
      values.push(metal);
      filtros.push(`metal = $${values.length}`);
    }

    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
    const query = `SELECT * FROM inventario ${where}`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en GET /joyas/filtros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
