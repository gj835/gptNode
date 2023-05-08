let movies // The reference to the database is stored in movies

import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

export default class MoviesDAO {
    // This method is called as soon as the server starts 
    // and provides the database reference to movies.
    static async injectDB(conn) {
        // if the reference already exists, the execution of the function is stopped
        if (movies) {
            return
        }

        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS) 
                .collection('movies')
        }  
        catch(e) {
            console.error(`unable to connect in MoviesDAO: ${e}`) 
        }
    }

    static async getRatings() {
        let ratings = []
        try {
            ratings = await movies.distinct("rated") 
            return ratings
        }
        catch(e) {
            console.error(`unable to get ratings, $(e)`)
            return ratings
        }
    }

    static async getMovieById(id) {
        try {                                                 
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                { 
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()
        }
        catch(e) {
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }

    static async getMovies(
        // default filter 
        {
            filters = null,
            page = 0,
            moviesPerPage = 20, // will only get 20 movies at once 
        } = {}) {
        let query
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title']}}
            } else if ("rated" in filters){
                query = { "rated": { $eq: filters['rated']}}
            } 
        }
        
        let cursor
        try {
            cursor = await movies.find(query)
                    .limit(moviesPerPage)
                    .skip(moviesPerPage * page) 
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return {moviesList, totalNumMovies} 
        }
        catch(e) {
            console.error(`Unable to issue find command, ${e}`) 
            return { moviesList: [], totalNumMovies: 0}
        } 
    }
}