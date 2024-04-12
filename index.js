// Import required modules
const express = require('express');
require('dotenv').config();
const { Client } = require('pg');
const { knex } = require('knex'); // Import the Knex library and its destructuring


// Import the Knex configuration from knexfile.js
const knexConfig = require('./knexfile');

// Initialize Knex with the configuration for PostgreSQL
const knexInstance = knex(knexConfig.development); // Use knexConfig.development for the PostgreSQL configuration

const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users');

// Create an instance of Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use(cookieParser());


const connectionString = 'postgresql://elearning-db_owner:Mktp2LHTx9aU@ep-cool-base-a1cd5kkt.ap-southeast-1.aws.neon.tech/elearning-db?sslmode=require';  // Client class from the pg module. This class is used to create a client instance that can connect to a PostgreSQL database.

const client = new Client({                                                
  connectionString: connectionString,  //connection string containing postgre protocol , username , password ,the host name or IP address of database instance.
});

client.connect()
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database', err));


app.use('/api/users', usersRouter);


// Define routes
// ...

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
