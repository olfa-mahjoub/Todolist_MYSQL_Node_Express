const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_naissance: {
        type: DataTypes.DATEONLY,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["homme", "femme"],
      },
      created_at: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("created_at"))
            .utcOffset("+0100")
            .format("YYYY-MM-DD HH:mm:ss");
        },
      },
      updated_at: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("updated_at"))
            .utcOffset("+0100")
            .format("YYYY-MM-DD HH:mm:ss");
        },
      },
    },
    {
      timestamps: true, // Enable createdAt and updatedAt fields
      createdAt: "created_at", // Alias createdAt as created_at
      updatedAt: "updated_at", // Alias updatedAt as updated_at
      indexes: [
        {
          unique: true,
          fields: ["id"], // Ensure uniqueness on the 'id' field
        },
      ],
    }
  );

  return User;
};
