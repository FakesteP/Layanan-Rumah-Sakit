import Antrian from "../model/antrianModel.js";

const getAntrian = async (req, res) => {
  try {
    const response = await Antrian.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
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

export { getAntrian, createAntrian, updateAntrian, deleteAntrian, getAntrianById };