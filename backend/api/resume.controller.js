// import ResumeDAO from '../dao/resumeDAO.js'
import fs from 'fs'
import PDFParser from 'pdf-parse'
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import ResumeDAO from '../dao/resumeDAO.js'
import { concatTransformationMatrix } from 'pdf-lib'
import data from './test.json' assert {
    type: "json"
}

dotenv.config()
const testMode = false;

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
            } else if (file.originalname.split('.').pop() !== 'pdf') {
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
            let completionJSON
            if (!testMode) {
                const configuration = new Configuration({
                    organization: process.env.ORG_ID,
                    apiKey: process.env.OPENAI_API_KEY,
                })
                const openai = new OpenAIApi(configuration)
                const prompt = `convert the following resume to json in string format 
                                with three attribute: name, email and others, 
                                the resume is "${text}"`
                const { data } = await openai.createChatCompletion(
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [{'role': 'user', 'content': prompt}]
                    }
                )
                const completionString = data.choices[0].message.content
                completionJSON = JSON.parse(completionString)
            } else {
                console.log("test mode")
                completionJSON = data
            }
            // message example: {name, email, others}

            // 4. save json to database
            const addResponse = await ResumeDAO.add(
                completionJSON.name, 
                completionJSON.email, 
                JSON.stringify(completionJSON.others)
            )

            // 5. return json to frontend
            return res.status(200).json({
                success: true,
                message: addResponse,
                // message: completionJSON,
                date: new Date()
            })
        } catch (e) {
            const { message } = e
            console.error(`unable to process resume: ${message}`)
            return res.status(500).json({
                success: false,
                message: message,
                date: new Date()
            })
        }
    }

    static async apiGetResume(req, res) {
        try {
            const { email } = req.query
            console.log(`req` + req)
            const resume = await ResumeDAO.get(email)
            if (!resume) {
                res.status(400).json({
                    success: false,
                    message: `resume not found`,
                    date: new Date()
                })
            }
            res.status(200).json({
                success: true,
                message: resume,
                date: new Date()
            })
        } catch (e) {
            const { message } = e
            console.error(`apiGetResume: ${message}`)
            res.status(500).json({
                success: false,
                message: message,
                date: new Date()
            })
        }
    }
}
