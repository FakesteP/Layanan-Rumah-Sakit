import Antrian from "../model/antrianModel.js";
import User from "../model/userModel.js";
import Layanan from "../model/layananModel.js";

const getAntrian = async (req, res) => {
  try {
    const antrian = await Antrian.findAll({
      attributes: ['id', 'keluhan', 'status', 'tanggal_dibuat', 'user_id', 'layanan_id'],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Layanan,
          attributes: ["id", "nama_layanan"],  // pastikan ini sesuai dengan kolom sebenarnya
        },
      ],
    });

    console.log("Data antrian:", JSON.stringify(antrian, null, 2));

    res.json(antrian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAntrianById = async (req, res) => {
  try {
    const response = await Antrian.findOne({
      where: { id: req.params.id },
    });
    if (!response) {
      return res.status(404).json({ message: "Antrian tidak ditemukan" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createAntrian = async (req, res) => {
  try {
    await Antrian.create(req.body);
    res.status(200).json({ message: "Antrian berhasil ditambah" });
  } catch (error) {
    console.log(error.message);
  }
};

const updateAntrian = async (req, res) => {
  try {
    await Antrian.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Antrian berhasil diperbarui" });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteAntrian = async (req, res) => {
  try {
    await Antrian.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Antrian berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};

const getAntrianByUserId = async (req, res) => {
  try {
    const userId = req.userId; // <-- ini harus sesuai dengan middleware verifyToken

    const antrian = await Antrian.findAll({
      where: { user_id: userId },
      attributes: ['id', 'keluhan', 'status', 'tanggal_dibuat'],
      include: [
        {
          model: Layanan,
          attributes: ['id', 'nama_layanan'],
        },
      ],
      order: [['tanggal_dibuat', 'DESC']],
    });

    res.status(200).json(antrian);
  } catch (error) {
    console.error("Gagal mengambil riwayat antrian:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat antrian" });
  }
};



export {
  getAntrian,
  createAntrian,
  updateAntrian,
  deleteAntrian,
  getAntrianById,
  getAntrianByUserId
};
