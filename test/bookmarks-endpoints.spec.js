const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

describe.only('Bookmarks Endpoints', function() {
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  context.only('Given there are bookmarks in the database', () => {
    const testBookmarks = makeBookmarksArray()
    
    beforeEach('insert bookmarks', () => {
      return db('bookmarks')
        .insert(testBookmarks)
    })

    it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
        return supertest(app)
            .get("/bookmarks")
            .expect(200, testBookmarks)
    });

  })

})