const path = require('path')
const express = require('express')
const logger = require('./logger')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('')
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
          .location(path.posix.join(req.originalUrl + `/${bookmark.id}`))
          .json(bookmark)
          logger.info(`Bookmark with id ${bookmark.id} created`);
      })
      .catch(next)

});

bookmarksRouter
  .route('/:id')
  .all((req, res, next) => {
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
        res.bookmark = bookmark
        next()
    })
    .catch(next)
  })

  .get((_, res) => {
    res.json(res.bookmark);
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
  })

  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body
    const bookmarkToUpdate = { title, url, description, rating }
    
    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'url', 'description' or 'rating'`
        }
      })
    }

    BookmarksService.updateBookmark(
      req.app.get('db'),
      req.params.id,
      bookmarkToUpdate
    )
      .then(numRowsAffected => {
        res.json({...bookmarkToUpdate, id:req.params.id})
      })
      .catch(next)
  })

module.exports = bookmarksRouter