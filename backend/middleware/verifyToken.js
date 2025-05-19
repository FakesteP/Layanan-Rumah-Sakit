import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token tidak tersedia" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });

    req.userId = decoded.id;
    req.email = decoded.email;
    req.username = decoded.username;
    req.role = decoded.role;

    next();
  });
};
