const { HttpError } = require("../utils/httpError");

function validate(schema, source = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new HttpError(
          400,
          "Validation failed",
          result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message
          }))
        )
      );
    }

    req[source] = result.data;
    next();
  };
}

module.exports = { validate };
