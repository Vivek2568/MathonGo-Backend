module.exports = (req, res, next) => {
  const isAdmin = req.headers["admin"] === "true";
  if (!isAdmin) return res.status(403).json({ error: "Admin access required" });
  next();
};
