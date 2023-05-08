let resume

import mongodb from "mongodb"
// const ObjectId = mongodb.ObjectId

export default class ResumeDAO {
    static async injectDB(conn) {
        if (resume) {
            return
        }

        try {
            resume = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('resume')
        }
        catch (e) {
            console.error(`unable to connect in ResumeDAO: ${e}`)
        }
    }

    // static async uploadResume(user, rawResume, date) {
    //     try {
    //         const resumeDoc = {
    //             name: user.name,
    //             user_id: user._id,
    //             date: date,
    //             resumeOriginal: rawResume,
    //         }
    //         return await resume.insertOne(resumeDoc)
    //     } catch (e) {
    //         console.error(`unable to upload resume: ${e}`)
    //         return { error: e }
    //     }
    // }

    // static async getResume(userId) {
    //     try {
    //         return await resume.find({ user_id: userId }).toArray()
    //     } catch (e) {
    //         console.error(`something went wrong in getResume: ${e}`)
    //         throw e
    //     }
    // }
}