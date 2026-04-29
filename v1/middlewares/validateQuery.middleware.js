
export const validateQueryMiddleware = schema => (
    req,
    res,
    next
) => {

    const { error, value } =
        schema.validate(req.query, {
            abortEarly: false
        });

    if (error) {

        return res.status(400).json({
            mensaje: "Error en query params",
            error: error.details
        });
    }

    req.validatedQuery = value;

    next();
};