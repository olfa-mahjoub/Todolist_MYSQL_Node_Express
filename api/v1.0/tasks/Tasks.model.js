var moment = require("moment");

// require
module.exports = (sequelize, DataTypes) => {
    const Tasks = sequelize.define(
        "tasks",
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            categorie_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            priority: {
                type: DataTypes.ENUM("low", "medium", "high"),
                defaultValue: "low",
            },
            status: {
                type: DataTypes.ENUM("pending", "in_progress", "completed"),
                defaultValue: "pending",
            },
            due_date: {
                type: DataTypes.DATE,
                allowNull: true,
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
    return Tasks;
};
