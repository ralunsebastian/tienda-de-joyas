const logger = (req, res, next) => {
  const fecha = new Date().toISOString();
  console.log(`[${fecha}] Se consultó la ruta: ${req.method} ${req.originalUrl}`);
  next();
};

export default logger;
