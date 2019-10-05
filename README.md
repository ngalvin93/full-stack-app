# Basic express.js app using knex.js

A very basic [express.js] application using [knex.js].

[express.js]:https://expressjs.com/
[knex.js]:http://knexjs.org/

## Development Setup

```sh
# installs node_modules/ folder
npm install

# initialize database schema to latest migration
npx knex migrate:latest

# initialize database with seed data
npx knex seed:run

# start express.js server on port 3000
node index.js
```

## License

[ISC License](LICENSE.md)

- make a new template for the Cohorts page
- add a new route for Students /students/65 should render student with id = 65
- add a migration + seed for Assignments, link assignments to Students with a SQL JOIN (hard mode) (edited) 
- add new route + page for student assignments (hard mode)
- add startDate and endDate input elements for creating a cohort (hint: check out `<input type="date">`)