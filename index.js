const fs = require('fs')
const mustache = require('mustache')

const express = require('express')
const app = express()

const dbConfigs = require('./knexfile.js')
const db = require('knex')(dbConfigs.development) // this is the database connection and you only need one per application!

// const environment = 'development';
// const dbConfigs = require('./knexfile.js')[environment];
// const db = require('knex')(dbConfigs);

const port = 3000

// -----------------------------------------------------------------------------
// Mustache templates

const homepageTemplate = fs.readFileSync('./templates/homepage.mustache', 'utf8')
const cohortTemplate = fs.readFileSync('./templates/new-cohort.mustache', 'utf8')
const allCohortsTemplate = fs.readFileSync('./templates/all-cohorts.mustache', 'utf8')
const findStudentTemplate = fs.readFileSync('./templates/find-student.mustache', 'utf8')
// -----------------------------------------------------------------------------
// Express.js Endpoints

app.use(express.urlencoded())

app.get('/', function (req, res) {
  getAllCohorts()
    .then(function (allCohorts) {
      res.send(mustache.render(homepageTemplate, { cohortsListHTML: renderAllCohorts(allCohorts) }))
    })
})

app.get('/students/:id', function (req, res) {
  console.log('Request param: ',req.params.id)
  getSingleStudent(req.params.id)
    .then(function (student) {
      // console.log('This is the student response: ',student)
      // res.send('<pre>' + prettyPrintJSON(student) + '</pre>')
      res.send(mustache.render(findStudentTemplate, { findStudentHTML: renderSingleStudent(student) }))
    })
    .catch(function (err) {
      console.log(err)
      res.status(500).send(`There is no student with the id ${req.params.id}`)
    })
})

app.get('/cohorts', function (req, res) {
  getAllCohorts()
    .then(function (allCohorts) {
      res.send(mustache.render(allCohortsTemplate, {allCohortsListHTML: renderAllCohorts(allCohorts)}))
    })
})

app.post('/cohorts', function (req, res) {
  console.log('This is the request body: ',req.body)
  console.log('This is the title: ',req.body.title)
  console.log('This is the slug: ',req.body.slug)
  createCohort(req.body)
    .then(function (response) {
      //console.log(req.body)
      console.log(response)
      res.send(mustache.render(cohortTemplate, { newCohortHTML: renderNewCohort(response) }))
    })
    .catch(function (err) {
      console.log(err)
      res.status(500).send('something went wrong. waaah, waaah')
    })
})

app.get('/cohorts/:slug', function (req, res) {
  getOneCohort(req.params.slug)
    .then(function (cohort) {
      res.send('<pre>' + prettyPrintJSON(cohort) + '</pre>')
    })
    .catch(function (err) {
      res.status(404).send('cohort not found :(')
    })
})

app.listen(port, function () {
  console.log('Listening on port ' + port + ' 👍')
})

// -----------------------------------------------------------------------------
// HTML Rendering

function renderCohort (cohort) {
  return `<li><a href="/cohorts/${cohort.slug}">${cohort.title}</a></li>`
}

function renderAllCohorts (allCohorts) {
  return '<ul>' + allCohorts.map(renderCohort).join('') + '</ul>'
}

function renderNewCohort (cohort) {
  console.log(cohort)
  return `<h1>${cohort.title}</h1><h1>${cohort.slug}</h1>`
}

function renderSingleStudent (student) {
  let activeStatus = []
  if (student.isActive === 1) {
    activeStatus.push('Current Student')
  } else {
    activeStatus.push('Not a Current Student')
  }
  return `<p>${student.name}</p><p>${activeStatus[0]}</p>`
}

// -----------------------------------------------------------------------------
// Database Queries

const getAllCohortsQuery = `
  SELECT *
  FROM Cohorts
`

function getSingleStudent (id) {
  return db.raw('SELECT * FROM Students WHERE id = ?', [id])
  .then(function (results) {
    if (results.length === 0) {
      throw null
    } else {
      return results[0]
    }
  })
}

function getAllCohorts () {
  return db.raw(getAllCohortsQuery)
}

function getOneCohort (slug) {
  return db.raw('SELECT * FROM Cohorts WHERE slug = ?', [slug])
    .then(function (results) {
      console.log(results)
      return results
    })
    .then(function (results) {
      if (results.length !== 1) {
        throw null
      } else {
        return results[0]
      }
    })
}

function createCohort (cohort) {
  return db.raw('INSERT INTO Cohorts (title, slug, isActive) VALUES (?, ?, true); SELECT last_insert_rowid();', [cohort.title, cohort.slug])
}

// -----------------------------------------------------------------------------
// Misc

function prettyPrintJSON (x) {
  return JSON.stringify(x, null, 2)
}
