import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'
import resume from './api/resume.route.js'

const app = express() // create express app
app.use(cors()) 
//The JSON parsing middleware express.json enables the server to read and accept JSON in a request’s body.
app.use(express.json()) 

// Specify the initial routes for our application
app.use("/api/v1/movies", movies) 
app.use("/api/v1/resume", resume)

// If someone tries to go to a route that doesn’t exist, 
// The wild card route app.use('*') returns a 404 page with a not found message.
app.use('*', (req,res)=>{
    res.status(404).json({error: "not found"}) 
})

// Export app as a module so that other files can import it. 
// This allows us to separate our main server code 
// from our database code.
export default app
