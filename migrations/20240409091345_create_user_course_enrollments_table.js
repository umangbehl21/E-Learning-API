exports.up = function(knex) {
    return knex.schema.createTable('user_course_enrollments', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('course_id').unsigned().references('id').inTable('courses');
      // Optionally, you can add additional columns such as enrollment date, etc.
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_course_enrollments');
  };
  