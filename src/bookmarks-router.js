const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./logger')
const { bookmarks } = require('./store')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks)
    })
    .catch(next)
  })

  .post(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const knexInstance = req.app.get('db')

    if (!title) {
        logger.error(`Title is required`);
        return res
            .status(400)
            .json({ error: { message: "Missing 'title' in request body" } });
    }

    if (!url) {
        logger.error(`url is required`);
        return res
            .status(400)
            .json({ error: { message: "Missing 'url' in request body" } });
    }

    if (!description) {
      logger.error('description is required');
      return res
        .status(400)
        .json({ error: { message: "Missing 'description' in request body" } });
    }

    if (!rating) {
      logger.error('rating is required');
      return res
        .status(400)
        .json({ error: { message: "Missing 'rating' in request body" } });
    }

    const bookmark = {
        title,
        url,
        description,
        rating
    };

    BookmarksService.insertBookmark(knexInstance, bookmark)
      .then(bookmark => {
        res
          .status(201)
          .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
          .json(bookmark)
          logger.info(`Bookmark with id ${bookmark.id} created`);
      })
      .catch(next)

});

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .json({ message: "Bookmark doesn't exist" });
        }

        res.json(bookmark);
    })
    .catch(next)
  })

  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db')
    BookmarksService.deleteBookmark(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .json({ message: "Bookmark doesn't exist" });
        }
        logger.info(`Bookmark with id ${id} deleted.`);
        res
          .status(204)
          .end();;
    })
    .catch(next)
  });

module.exports = bookmarksRouter