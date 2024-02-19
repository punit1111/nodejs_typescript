import { Sequelize } from "sequelize";

const sequelize = new Sequelize("flipcart", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
