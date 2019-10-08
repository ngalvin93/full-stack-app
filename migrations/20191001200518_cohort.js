
exports.up = function(knex) {
  return knex.schema.createTable('Cohort', (table) => {
    table.increments()
    table.string('title')
    table.string('slug')
    table.boolean('isActive')
    table.datetime('startDate')
    table.datetime('endDate')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('Cohort')
};