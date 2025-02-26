import * as dotenv from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';

dotenv.config();

const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    reddit: {
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        userAgent: process.env.REDDIT_USER_AGENT,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
    },
    database: {
        uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/reddit-mod-bot',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
    rules: {
        defaultAction: process.env.DEFAULT_ACTION || 'ignore',
    },
};

const loadConfigFile = (filePath: string) => {
    try {
        const configFile = readFileSync(filePath, 'utf-8');
        return JSON.parse(configFile);
    } catch (error) {
        console.error(`Could not load config file at ${filePath}:`, error);
        return {};
    }
};

const environmentConfig = loadConfigFile(join(__dirname, '../../config', `${config.environment}.json`));
const finalConfig = { ...config, ...environmentConfig };

export default finalConfig;