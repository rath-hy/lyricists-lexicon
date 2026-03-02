require('dotenv').config()
console.log(process.env.DATABASE_URL)
const express = require('express')
const cors = require('cors')
const { connectToDatabase, sequelize } = require('./util/db')
const { Word, Syllable } = require('./models')
const { Op } = require('sequelize')

const app = express()
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/search', async (req, res) => {
  const { query } = req.query

  const words = await Word.findAll({
    where: {
      word: { [Op.like]: `%${query}%` }
    },
    limit: 10
  })

  res.json(words)
})

// add new endpoint
app.get('/api/words/:id', async (req, res) => {
  const word = await Word.findByPk(req.params.id)
  res.json(word)
})

app.get(`/api/consonance`, async (req, res) => {
  const onset_combo = req.query.onset_combo
  const words = await Word.findAll({
    where: {
      onset_combination: onset_combo
    },
  })
  
  res.json(words.map(w => ({
    id: w.id,
    word: w.word,
    syllable_count: w.syllable_count,
    onset_permutation: w.onset_permutation
  })))
})

app.get('/api/rhyme', async (req, res) => {
  const { nuclei } = req.query
  const nucleiList = nuclei.split('\xa0')

  const words = await Word.findAll({
  where: sequelize.where(
    sequelize.fn('CONCAT', '\xa0', sequelize.col('rhyme_permutation'), '\xa0'),
    { [Op.like]: `%\xa0${nuclei}\xa0%` }
  )
  })

  const wordsWithPos = words.map(w => {
    const syllables = w.rhyme_permutation.split('\xa0')
    const startPos = syllables.findIndex((s, i) =>
      nucleiList.every((nc, j) => syllables[i + j] === nc)
    )
    const distanceToEnd = w.syllable_count - startPos - 1
    return {
      id: w.id,
      word: w.word,
      syllable_count: w.syllable_count,
      rhyme_permutation: w.rhyme_permutation,
      distanceToEnd
    }
  })

  wordsWithPos.sort((a, b) => a.distanceToEnd - b.distanceToEnd || a.syllable_count - b.syllable_count)

  res.json(wordsWithPos)

})

const start = async () => {
  await connectToDatabase()
  await sequelize.sync()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()