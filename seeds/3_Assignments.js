
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Assignments').del()
    .then(function () {
      // Inserts seed entries
      return knex('Assignments').insert([
        {
          id: 1,
          assignments: 'Complete full-stack app',
          isComplete: false,
          startDate: '2019-10-05',
          endDate: '2019-10-05'
        },
        {
          id: 2,
          assignments: 'Research how to make a join',
          isComplete: true,
          startDate: '2019-10-03',
          endDate: '2019-10-04'
        },
        {
          id: 3,
          assignments: 'Start on phase 2 project',
          isComplete: false,
          startDate: '2019-10-12',
          endDate: '2019-10-12'
        }
      ]);
    });
};