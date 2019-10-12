
exports.up = function(knex) {
return knex.schema.createTable('User', function (table) {
    table.integer('studentId')
      .notNullable()
      .references('id')
      .inTable('Student')
      .onDelete('CASCADE')
      .index()
    table.string('username')
      .notNullable()
    table.string('password')
      .notNullable()
})
};

exports.down = function(knex) {
  return knex.schema.dropTable('User')
};
