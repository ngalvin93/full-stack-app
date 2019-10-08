
exports.up = function (knex) {
    return knex.schema.createTable('Assignment', (table) => {
        table.increments()
        table.string('assignment')
        table.boolean('isComplete')
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('studentId')
        // table.foreign('studentId')
            .notNullable()
            .references('id')
            .inTable('Student')
            .onDelete('CASCADE')
            .index()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('Assignment')
};