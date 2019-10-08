
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Assignment').del()
    .then(function () {
      // Inserts seed entries
      return knex('Assignment').insert([
        {
          assignment: 'Complete full-stack app',
          isComplete: false,
          startDate: '2019-10-05',
          endDate: '2019-10-05',
          studentId: 1
        },
        {
          assignment: 'Research how to make a join',
          isComplete: true,
          startDate: '2019-10-03',
          endDate: '2019-10-04',
          studentId: 2
        },
        {
          assignment: 'Start on phase 2 project',
          isComplete: false,
          startDate: '2019-10-12',
          endDate: '2019-10-12',
          studentId: 2
        }
      ]);
    });
};