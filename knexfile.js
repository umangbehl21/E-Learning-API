//The knexfile.js serves as a central configuration file for Knex.js, providing settings for database connections, migrations, seeds, and other options

module.exports = {
    development: {
      client: 'postgresql', // Database client (PostgreSQL)
      connection: {
        host: 'ep-cool-base-a1cd5kkt.ap-southeast-1.aws.neon.tech', // Database host
        port: 5432, // Database port (default PostgreSQL port)
        database: 'elearning-db', // Database name
        user: 'elearning-db_owner', // Database username
        password: 'Mktp2LHTx9aU', // Database password
        ssl: { //SL is a protocol that provides secure communication over a computer network. In the context of databases, SSL is used to encrypt data transmitted between the client (your application) and the database server
          rejectUnauthorized: false // Allow connection to SSL-enabled databases (if required) only ssl  if rejectUnauthorized is set to true, it means that the SSL connection will reject connections to servers with self-signed certificates or certificates that are not trusted by the client.
        }
      },
      migrations: {
        directory: './migrations', // Directory containing migration files 
      },
      seeds: {
        directory: './seeds', // Directory containing seed files (optional)
      },
    },
  };
  