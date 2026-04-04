module.exports = {
    production: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT || 5432),
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            channelBinding: true,
        },
        logging: false,
    },
};
