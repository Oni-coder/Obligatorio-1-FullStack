export const validateBody = schema => (req, res, next) => {
    const { value, error } = schema.validate(req.body, { 
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        return res.status(400).json({
            message: "Error de validación",
            errors: error.details.map(e => e.message)
        });
    }

    req.body = value;
    next();
};