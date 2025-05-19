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
    await Layanan.create(req.body);
    res.status(200).json({ message: "Layanan berhasil dibuat" });
  } catch (error) {
    console.log(error.message);
  }
};

const updateLayanan = async (req, res) => {
  try {
    await Layanan.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Layanan berhasil diperbarui" });
  } catch (error) {
    console.log(error.message);
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

export { getLayanan, createLayanan, updateLayanan, deleteLayanan, getLayananById };