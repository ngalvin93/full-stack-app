exports.up = function(knex) {
  return knex.schema.createTable('Student', (table) => {
    table.increments()
    table.string('name')
    table.boolean('isActive')
    table.integer('cohortId')
    // table.foreign('cohortId')
      .notNullable()
      .references('id')
      .inTable('Cohort')
      .onDelete('CASCADE')
      .index()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('Student')
};
