exports.up = function(knex) {
  return knex.schema.createTable('Student', (table) => {
    table.increments('id')
    table.string('name')
    table.boolean('isActive')
    table.integer('cohortId')
    table.foreign('cohortId').references('id').inTable('Cohort')
  })
};

exports.down = function(knex) {
  return knex.schema.raw('DROP TABLE Student')
};
