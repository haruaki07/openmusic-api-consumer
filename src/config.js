const config = {
  env: process.env.NODE_ENV,
  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  rabbitmq: {
    url: process.env.RABBITMQ_SERVER
  },
  smtp: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_ADDRESS,
    password: process.env.MAIL_PASSWORD
  }
};

module.exports = config;
