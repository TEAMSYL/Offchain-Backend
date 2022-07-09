module.exports = (sequelize, DataTypes) => {
  const ProductImg = sequelize.define(
    "Product_imgs",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      imgUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true, // createAt, updateAt 활성화
      paranoid: true, // deleteAt 옵션
    }
  );
};
