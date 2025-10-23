/**
 * Basic API request/response logger.
 * - Logs incoming method and URL, presence of token, optional userId.
 * - Logs response status and duration on finish.
 * Does not log request bodies to avoid leaking credentials.
 */
module.exports = function apiLogger(req, res, next) {
  const start = Date.now();
  const hasToken = Boolean(req.headers['x-access-token']);
  const userId = req.query?.userId || req.body?.userId || undefined;
  try {
    console.log(
      `[API] -> ${req.method} ${req.originalUrl} token=${hasToken} userId=${userId ?? '-'}`,
    );
  } catch (e) {
    // no-op
  }

  res.on('finish', () => {
    const ms = Date.now() - start;
    try {
      console.log(`[API] <- ${res.statusCode} ${req.method} ${req.originalUrl} ${ms}ms`);
    } catch (e) {
      // no-op
    }
  });

  next();
};
