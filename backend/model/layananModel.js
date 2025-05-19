import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Layanan = db.define(
  "layanan",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_layanan: { type: Sequelize.STRING, allowNull: false },
    deskripsi: { type: Sequelize.TEXT },
    durasi_layanan: { type: Sequelize.INTEGER },
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui",
  }
);

export default Layanan;
