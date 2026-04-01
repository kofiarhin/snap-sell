const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const err = result.error;
    err.name = "ZodError";
    return next(err);
  }
  req[source] = result.data;
  next();
};

module.exports = validate;
