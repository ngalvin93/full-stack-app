
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([
        {studentId: '1', username: 'user1', password: '1234'},
        {studentId: '2', username: 'user2', password: '12345'},
        {studentId: '3', username: 'user3', password: '123456'}
      ]);
    });
};
