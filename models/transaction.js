const Sequelize = require("sequelize");

module.exports = class Transaction extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.STRING,
          defaultValue: "before",
          allowNull: false,
        },
        buyer_address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        seller_address: {
          type: Sequelize.STRING,
        },
        seller_privatekey: {
          type: Sequelize.STRING,
        },
        price: {
          type: Sequelize.INTEGER,
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
};
