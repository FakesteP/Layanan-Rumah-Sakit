export const isAdmin = (req, res, next) => {
  try {
    if (!req.role) {
      return res.status(403).json({
        status: "forbidden",
        message: "Role pengguna tidak ditemukan dalam token. Akses ditolak.",
      });
    }

    if (req.role !== "admin") {
      return res.status(403).json({
        status: "forbidden",
        message: "Akses ditolak: hanya admin yang diizinkan mengakses resource ini.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada middleware isAdmin",
    });
  }
};