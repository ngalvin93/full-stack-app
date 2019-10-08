
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Cohort').del()
    .then(function () {
      // Inserts seed entries
      return knex('Cohort').insert([
        {
          id: 1,
          title: '2019 June Houston Flex',
          slug: '2019-06-houston-flex',
          isActive: true,
          startDate: '2019-06-18',
          endDate: '2020-01-07'
        },
        {
          id: 2,
          title: '2018 September Houston Flex',
          slug: '2018-09-houston-flex',
          isActive: false,
          startDate: '2018-09-14',
          endDate: '2019-04-02'
        }
      ]);
    });
};
