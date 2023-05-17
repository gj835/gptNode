import dotenv from 'dotenv'
import { Sequelize, DataTypes } from 'sequelize'

dotenv.config()

// Test connection to the PostgreSQL database on TimescaleDB
// TIMESCALE_HOST_KEY
const sequelize = new Sequelize(process.env.TIMESCALE_HOST_KEY)
try {
    await sequelize.authenticate()
    console.log('PostgreSQL connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to PostgreSQL:', error)
}

// sequelize model: people
const People = sequelize.define('People', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(1234),
        allowNull: false,
        primaryKey: true 
    },
    other: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'peoples',
    timestamps: false
})

export default class ResumeDAO {
    static async add(name, email, other) {
        try {
            if (this.get(email).length != 0) {
                throw new Error(`resumeDAO: add failed ${email} already exists`)
            }
            // const newPeople = 
            await People.create({
                name,
                email,
                other
            })
        } catch (e) {
            console.log(`resumeDAO add failed: ${e}`)
        }
    }

    static async update(name, email, other) {
        try {
            // const updatePeople = 
            await People.update({
                name,
                email,
                other
            })
        } catch (e) {
            console.log(`resumeDAO update failed: ${e}`)
        }
    }

    static async delete(name, email, other) {
        try {
            // const deletePeople = 
            await People.destroy({
                where: {
                    name,
                    email,
                    other
                }
            })
        } catch (e) {
            console.log(`resumeDAO delete failed: ${e}`)
        }
    }

    static async get(email) {
        try {
            const people = await People.findAll({
                where: {
                    // name: name,
                    email: email
                }
            })
            return people
        } catch (e) {
            console.log(`resumeDAO get failed: ${e}`)
        }
    }
}
