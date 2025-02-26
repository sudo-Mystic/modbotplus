import { Sequelize } from 'sequelize';
import { config } from '../utils/config';

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    logging: config.database.logging,
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize, connectDatabase };