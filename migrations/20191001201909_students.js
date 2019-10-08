exports.up = function(knex) {
  return knex.schema.createTable('Students', (table) => {
    table.increments('id')
    table.string('name')
    table.boolean('isActive')
    table.integer('cohortId')
    table.foreign('cohortId').references('id').inTable('Cohorts')
  })
};

exports.down = function(knex) {
  return knex.schema.raw('DROP TABLE Students')
};
