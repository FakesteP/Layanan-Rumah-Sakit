import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModel.js";
import Layanan from "./layananModel.js";

const Antrian = db.define(
  "antrian",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    layanan_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "layanan", key: "id" },
    },
    keluhan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("menunggu", "dipanggil", "selesai", "batal"),
      defaultValue: "menunggu",
    },
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui",
  }
);

// Relasi ke Layanan
Layanan.hasMany(Antrian, { foreignKey: "layanan_id" });
Antrian.belongsTo(Layanan, { foreignKey: "layanan_id" });

// ✅ Tambahkan relasi ke User
User.hasMany(Antrian, { foreignKey: "user_id" });
Antrian.belongsTo(User, { foreignKey: "user_id" });

export default Antrian;
