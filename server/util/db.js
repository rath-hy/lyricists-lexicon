// const { Sequelize } = require('sequelize')

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
// })

// const connectToDatabase = async () => {
//   try {
//     await sequelize.authenticate()
//     console.log('Connected to the database')
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//     process.exit(1)
//   }
// }

// module.exports = { sequelize, connectToDatabase }

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const connectToDatabase = async () => {
  await sequelize.authenticate()
  console.log('Connected to database')
}

module.exports = { sequelize, connectToDatabase }