// Where does the app id and secret live?
// What is the data type that the sql queries return?
// How to handle promise responses to access values?
// Should we html template every page?
// Where does app.static come into play?
// What does cors module do?
// What does body parser do?


const fs = require('fs')
const mustache = require('mustache')

const express = require('express')
const app = express()

const dbConfigs = require('./knexfile.js')
const db = require('knex')(dbConfigs.development) // this is the database connection and you only need one per application!

// const environment = 'development';
// const dbConfigs = require('./knexfile.js')[environment];
// const db = require('knex')(dbConfigs);

const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

const bodyParser = require('body-parser')

const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_APP_ID = '2391198310978732';
const FACEBOOK_APP_SECRET = 'ba92420b7339af1168fac130c3526df8';

const GitHubStrategy = require('passport-github').Strategy;
const GITHUB_CLIENT_ID = "Iv1.ccbbd3cd062d00a6"
const GITHUB_CLIENT_SECRET = "25801f0081c4629b5649d0cebb01c7ff3ecdb2d8";


const port = process.env.PORT || 3000

// -----------------------------------------------------------------------------
// Mustache templates

const homepageTemplate = fs.readFileSync('./templates/homepage.mustache', 'utf8')
const cohortTemplate = fs.readFileSync('./templates/new-cohort.mustache', 'utf8')
const allCohortsTemplate = fs.readFileSync('./templates/all-cohorts.mustache', 'utf8')
const findStudentTemplate = fs.readFileSync('./templates/find-student.mustache', 'utf8')
const loginTemplate = fs.readFileSync('./templates/login.mustache', 'utf8')
// -----------------------------------------------------------------------------
// Express.js Endpoints

app.use(express.urlencoded())
app.use(session({secret: 'abcdefg'})); // provide any secret string
app.use(passport.initialize()); // connects passport to express
app.use(passport.session());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  getAllCohorts()
    .then(function (allCohorts) {
      res.send(mustache.render(homepageTemplate, { cohortsListHTML: renderAllCohorts(allCohorts) }))
    })
    .catch(function (err) {
      console.log(err)
      res.status(500).send('There was an error connecting...')
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
  // console.log('This is the request body: ',req.body)
  // console.log('This is the title: ',req.body.title)
  // console.log('This is the slug: ',req.body.slug)
  createCohort(req.body)
    .then(function (response) {
      // console.log(req.body)
      // console.log('This is the promise response from the cohort post: ', response)
      // res.send(mustache.render(cohortTemplate, { newCohortHTML: renderNewCohort(response) }))
      res.send(mustache.render(cohortTemplate, { newCohortHTML: renderNewCohort(response)}))
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

// -----------------------------------------------------------------------------
// Login

app.get('/login', passport.authenticate('oauth2',{
  session: true,
  successReturnToOrRedirect: '/'
}))

app.get('/success', function (req, res) {
  res.send('Welcome!')
})

app.get('/error', function (req, res) {
  res.send('There was an error logging in...')
})

passport.serializeUser(function (user, cb) {
  // placeholder for custom user serialization
  //null is for errors
  cb(null, user)
})

passport.deserializeUser(function(id, cb) {
  getStudent.then(function(results) {
    if (results.length === 0) {
      cb(err, null);
    } else {
      cb(err, results[0]);
    }
  })
});

// -----------------------------------------------------------------------------
// FACEBOOK

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });

// -----------------------------------------------------------------------------
// GITHUB

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}
));

app.get('/auth/github',
passport.authenticate('github'));

app.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/error' }),
function(req, res) {
  res.redirect('/success');
});

// -----------------------------------------------------------------------------
// PORT

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
  return `<h1>${cohort[0].title}</h1><p>localhost:3000/cohorts/${cohort[0].slug}</p>`
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

// const getAllCohortsQuery = 'SELECT * FROM Cohort;'


function getStudent (id) {
  // return db.raw('SELECT * FROM Student WHERE id = ?', [id])
  return db.select().from('Student').where({
    id: id
  })
}

function getSingleStudent (id) {
  // return db.raw('SELECT * FROM Student WHERE id = ?', [id])
  return db.select().from('Student').where({
    id: id
  })
  .then(function (results) {
    if (results.length === 0) {
      throw null
    } else {
      return results[0]
    }
  })
}

function getAllCohorts () {
  return db.select().from('Cohort')
  // return db.raw(getAllCohortsQuery)
}

function getOneCohort (slug) {
  // return db.raw('SELECT * FROM Cohort WHERE slug = ?', [slug])
  return db.select().from('Cohort').where({
    slug: slug
  })
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
  // return db.raw('INSERT INTO Cohort (title, slug, isActive) VALUES (?, ?, true); SELECT last_insert_rowid();', [cohort.title, cohort.slug])
  return db
  .returning(['title','slug'])
  .insert([{
    title: cohort.title,
    slug: cohort.slug,
    isActive: true
  }])
    .into('Cohort')
}

// -----------------------------------------------------------------------------
// Misc

function prettyPrintJSON (x) {
  return JSON.stringify(x, null, 2)
}
