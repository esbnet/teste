// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_teste_db";
import UserModel from "../models/Teste_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.teste_db.host +
        ":" +
        properties.teste_db.port +
        "//" +
        properties.teste_db.user +
        "@" +
        properties.teste_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.teste_db.name,
      properties.teste_db.user,
      properties.teste_db.password,
      {
        host: properties.teste_db.host,
        dialect: properties.teste_db.dialect,
        port: properties.teste_db.port,
        logging: false
      }
    );
    this.dbConnection_teste_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_teste_db;
  }
}

export default new Database();
