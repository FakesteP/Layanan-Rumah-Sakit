import fs from "fs";
import path from "path";
import Layanan from "../model/layananModel.js";

const uploadFolder = path.resolve("public/uploads");

export const getLayanan = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const layananList = await Layanan.findAll();
    const data = layananList.map((l) => ({
      ...l.toJSON(),
      gambar: l.gambar ? `${baseUrl}/${l.gambar}` : null,
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getLayananById = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const layanan = await Layanan.findOne({ where: { id: req.params.id } });
    if (!layanan)
      return res.status(404).json({ message: "Layanan tidak ditemukan" });

    const data = {
      ...layanan.toJSON(),
      gambar: layanan.gambar ? `${baseUrl}/${layanan.gambar}` : null,
    };
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createLayanan = async (req, res) => {
  try {
    const { nama_layanan, deskripsi, durasi_layanan } = req.body;
    const gambar = req.file?.filename || "default.png";

    const newLayanan = await Layanan.create({
      nama_layanan,
      deskripsi,
      durasi_layanan: parseInt(durasi_layanan),
      gambar,
    });

    res.status(201).json({
      message: "Layanan berhasil dibuat",
      data: newLayanan,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateLayanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_layanan, deskripsi, durasi_layanan } = req.body;

    const layanan = await Layanan.findByPk(id);
    if (!layanan)
      return res.status(404).json({ message: "Layanan tidak ditemukan" });

    // Siapkan data update
    const updatedData = {
      nama_layanan,
      deskripsi,
      durasi_layanan: durasi_layanan
        ? parseInt(durasi_layanan)
        : layanan.durasi_layanan,
    };

    // Jika ada file baru, hapus file lama dan set nama file baru
    if (req.file) {
      if (layanan.gambar && layanan.gambar !== "default.png") {
        const oldImagePath = path.join(uploadFolder, layanan.gambar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedData.gambar = req.file.filename;
    }

    await Layanan.update(updatedData, { where: { id } });

    res.status(200).json({ message: "Layanan berhasil diperbarui" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteLayanan = async (req, res) => {
  try {
    const { id } = req.params;
    const layanan = await Layanan.findByPk(id);
    if (!layanan)
      return res.status(404).json({ message: "Layanan tidak ditemukan" });

    // Hapus file gambar jika bukan default
    if (layanan.gambar && layanan.gambar !== "default.png") {
      const filePath = path.join(uploadFolder, layanan.gambar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Layanan.destroy({ where: { id } });

    res.status(200).json({ message: "Layanan berhasil dihapus" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};
