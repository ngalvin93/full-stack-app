
exports.up = function(knex) {
return knex.schema.createTable('User', function (table) {
    table.increments()
    table.string('username')
    table.string('password')
})
};

exports.down = function(knex) {
  return knex.schema.dropTable('User')
};
