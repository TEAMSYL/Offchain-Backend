const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const User = require("./user");
const Product = require("./product");
const TransactionRequest = require("./transaction_request");
const TransactionPermit = require("./transaction_permit");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Product = Product;
db.TransactionRequest = TransactionRequest;
db.TransactionPermit = TransactionPermit;
User.init(sequelize);
Product.init(sequelize);
TransactionRequest.init(sequelize);
TransactionPermit.init(sequelize);

User.associate(db);
Product.associate(db);
TransactionRequest.associate(db);
TransactionPermit.associate(db);

module.exports = db;
