
exports.up = function(knex) {
    return knex.schema.createTable('Assignment', function (table) {
        table.increments('id')
        table.string('assignment')
        table.boolean('isComplete')
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('studentId')
        table.foreign('studentId'),references(Students.id)
    })
};

exports.down = function(knex) {
  
};
