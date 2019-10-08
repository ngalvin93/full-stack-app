
exports.up = function(knex) {
    return knex.schema.createTable('Assignment', (table) => {
        table.increments('id')
        table.string('assignment')
        table.boolean('isComplete')
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('studentId')
        table.foreign('studentId').references('id').inTable('Student')
    })
};

exports.down = function(knex) {
    return knex.schema.raw('DROP TABLE Assignment')
};