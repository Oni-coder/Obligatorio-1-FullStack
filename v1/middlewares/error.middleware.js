export const errorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
    details: err.details || null,
  });
};
