export function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Not found." });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request payload is too large." });
  }
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ message: "Malformed JSON in request body." });
  }

  res.status(500).json({ message: "An unexpected server error occurred." });
}
