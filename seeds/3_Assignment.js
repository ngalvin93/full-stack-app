
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Assignment').del()
    .then(function () {
      // Inserts seed entries
      return knex('Assignment').insert([
        {
          id: 1,
          assignment: 'Complete full-stack app',
          isComplete: false,
          startDate: '2019-10-05',
          endDate: '2019-10-05'
        },
        {
          id: 2,
          assignment: 'Research how to make a join',
          isComplete: true,
          startDate: '2019-10-03',
          endDate: '2019-10-04'
        },
        {
          id: 3,
          assignment: 'Start on phase 2 project',
          isComplete: false,
          startDate: '2019-10-12',
          endDate: '2019-10-12'
        }
      ]);
    });
};