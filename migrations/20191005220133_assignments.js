
exports.up = function(knex) {
    return knex.schema.createTable('Assignments', (table) => {
        table.increments('id')
        table.string('assignments')
        table.boolean('isComplete')
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('studentId')
        table.foreign('studentId').references('id').inTable('Students')
    })
};

exports.down = function(knex) {
    return knex.schema.raw('DROP TABLE Assignments')
};