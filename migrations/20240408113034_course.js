exports.up = function(knex) {
  return knex.schema.createTable('courses', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('instructor').notNullable();
    table.integer('duration').notNullable();
    table.enum('category', ['programming', 'marketing', 'web development']).notNullable();
    table.enum('level', ['easy', 'medium', 'hard']).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('courses');
};

  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('courses');
  };
  //DELETE FROM knex_migrations WHERE name = '20240408112953_category.js';