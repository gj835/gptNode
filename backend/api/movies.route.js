import express from 'express'
import MoviesController from './movies.controller.js' 
import ReviewsController from './reviews.controller.js'

const router = express.Router() // get access to express router

//router.route('/').get((req,res) => res.send('hello world')) 
router.route('/').get(MoviesController.apiGetMovies)
router.route('/id/:id').get(MoviesController.apiGetMovieById) // route to get a specific movie
router.route("/ratings").get(MoviesController.apiGetRatings) // route to get all ratings

router.route("/review")
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)
    
export default router