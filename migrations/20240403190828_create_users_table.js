exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary(); // Auto-incrementing primary key
    table.string('name').notNullable(); // User's name
    table.string('email').unique().notNullable(); // Unique email address
    table.string('password').notNullable(); // Password field
    table.string('profile_picture'); // Profile picture URL (optional)
    table.enu('role', ['user', 'admin']).defaultTo('user').notNullable(); // Role column with default role as 'user'
    table.timestamps(true, true); // Adds `created_at` and `updated_at` timestamps
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users'); // Rollback operation to drop the users table
};








  //Run Migrations: Once you have created migration files, you can run the migrations to apply changes to your database schema using:
  // knex migrate:latest
  // Rollback Migrations: To rollback the last batch of migrations, you can use:
  // knex migrate:rollback