import app from './server.js' 
import mongodb from "mongodb" 
import dotenv from "dotenv"
// DAO: Data Access Object
import MoviesDAO from "./dao/moviesDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"
// import ResumeDAO from "./dao/resumeDAO.js"

async function main(){ 
    // load the environment variables
    dotenv.config()
    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI)
    const port = process.env.PORT || 8000

    try {
        // Connect to the MongoDB cluster 
        await client.connect()

        await MoviesDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)
        // await ResumeDAO.injectDB(client)
        
        app.listen(port, () =>{
            console.log('server is running on port:'+port);
        })
    } catch (e) { 
        console.error(e); 
        process.exit(1)
    } 
}

main().catch(console.error);

// Use the await keyword to indicate that 
// we block further execution until that operation has been completed

// nodemon server
