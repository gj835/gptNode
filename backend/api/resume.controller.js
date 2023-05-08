// import ResumeDAO from '../dao/resumeDAO.js'
import fs from 'fs'
import PDFParser from 'pdf-parse'
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

export default class ResumeController {
    static async upload(req, res) {
        try {
            // 1. receive uploaded file
            const { file } = req // assume it is pdf file
            if (!file) {
                res.status(400).send({
                    success: false,
                    message: 'No file is selected.',
                    date: new Date()
                }) 
            } else if (file.orginalname.match(/\.(pdf)$/)) {
                res.status(400).send({
                    success: false,
                    message: 'Only pdf files are allowed.',
                    date: new Date()
                })
            }
            // uploaded file location: file.destination + file.filename
            
            // 2. convert pdf to text
            const dataBuffer = fs.readFileSync(file.destination + file.filename)
            const { text } = await PDFParser(dataBuffer)

            // 3. convert text to json
            const configuration = new Configuration({
                organization: process.env.ORG_ID,
                apiKey: process.env.OPENAI_API_KEY,
            })
            const openai = new OpenAIApi(configuration)

            const prompt = `convert the following resume to json in string format: 
                            ${text}`

            const { data } = await openai.createChatCompletion(
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{'role': 'user', 'content': prompt}]
                }
            )
            const completionString = data.choices[0].message.content
            const completionJSON = JSON.parse(completionString)

            // 4. save json to database
            // console.log(completionJSON)

            // 5. return json to frontend
            return res.status(200).json({
                success: true,
                message: completionJSON,
                date: new Date()
            })
        } catch (e) {
            const { message } = e
            console.error(`unable to process resume: ${message}`)
            return res.status(500).json({
                success: false,
                message,
                date: new Date()
            })
        }
    }
}
