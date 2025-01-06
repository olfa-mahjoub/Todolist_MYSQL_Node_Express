var moment = require("moment");

// require
module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "categories",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      timestamps: true,
      createdAt: "created_at", // alias createdAt as created_date
      updatedAt: "updated_at", // alias updatedAt as updated_at
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["id"],
        },
      ],
    }
  );
  return Categories;
};
