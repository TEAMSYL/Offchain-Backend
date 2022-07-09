const Sequelize = require("sequelize");

module.exports = class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: Sequelize.STRING,
          defaultValue: "before",
          allowNull: false,
        },
        productName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Product",
        tableName: "products",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Product.belongsTo(db.User, {
      foreignkey: "sellerId",
      targetKey: "id",
    });
    db.Product.hasMany(db.TransactionRequest, {
      foreignkey: "productId",
      sourceKey: "id",
    });
  }
};
