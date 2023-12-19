const isNumber = (paramName) => {
  return (req, res, next) => {
    const paramValue = req.params[paramName];
    if (isNaN(paramValue)) {
      return res.status(400).json({ error: `${paramName} must be a number` });
    }
    next();
  };
};

export default isNumber;
