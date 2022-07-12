const Sequelize = require("sequelize");

module.exports = class Transaction extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        contractAddress: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Transaction",
        tableName: "transactions",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Transaction.belongsTo(db.Product, {
      foreignKey: "productId",
      targetKey: "id",
    });
  }
};
