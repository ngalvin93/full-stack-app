
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Student').del()
    .then(function () {
      // Inserts seed entries
      return knex('Student').insert([
        {
          name: 'Aubrey',
          isActive: true,
          cohortId: 1
        },
        {
          name: 'Joey',
          isActive: true,
          cohortId: 1
        },
        {
          name: 'Ryan',
          isActive: false,
          cohortId: 1
        },
        {
          name: 'Sarah',
          isActive: true,
          cohortId: 2
        }
      ]);
    });
};
