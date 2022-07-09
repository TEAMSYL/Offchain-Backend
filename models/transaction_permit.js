const Sequelize = require("sequelize");

module.exports = class TransactionPermit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        productId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        buyerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        contractAddress: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Transaction_permit",
        tableName: "transaction_permits",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.TransactionPermit.belongsTo(db.TransactionRequest, {
      foreignkey: "productId",
      targetKey: "id",
    });
  }
};
