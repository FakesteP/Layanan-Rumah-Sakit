import Layanan from "../model/layananModel.js";

const getLayanan = async (req, res) => {
  try {
    const response = await Layanan.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const getLayananById = async (req, res) => {
  try {
    const response = await Layanan.findOne({
      where: { id: req.params.id },
    });
    if (!response) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createLayanan = async (req, res) => {
  try {
    const { nama_layanan, deskripsi, durasi_layanan } = req.body;
    let imageUrl = req.body.image || null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename};`
    } else if (!imageUrl) {
      imageUrl = "default";
    }

    await Layanan.create({
      nama_layanan,
      deskripsi,
      durasi_layanan: parseInt(durasi_layanan),
      gambar: imageUrl,
    });

    res.status(200).json({
      message: "Layanan berhasil dibuat",
      file: req.file,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateLayanan = async (req, res) => {
  try {
    const { nama_layanan, deskripsi, durasi_layanan } = req.body;

    let updatedData = {
      nama_layanan,
      deskripsi,
      durasi_layanan: durasi_layanan ? parseInt(durasi_layanan) : undefined,
    };

    if (req.file) {
      // Cari data layanan lama untuk hapus gambar lama jika ada
      const layanan = await Layanan.findByPk(req.params.id);
      if (layanan && layanan.gambar && layanan.gambar !== "default") {
        const oldImagePath = path.join("public/uploads", layanan.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedData.gambar = req.file.filename;
    }

    // Hapus properti undefined agar tidak update null
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    await Layanan.update(updatedData, {
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Layanan berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteLayanan = async (req, res) => {
  try {
    await Layanan.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Layanan berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};

export {
  getLayanan,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  getLayananById,
  upload,
};
