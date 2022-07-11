const Sequelize = require("sequelize");

module.exports = class TransactionRequest extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        sellerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
          defaultValue: "requested",
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Transaction_request",
        tableName: "transaction_requests",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.TransactionRequest.belongsTo(db.Product, {
      foreignKey: "productId",
      targetKey: "id",
    });
  }
};
