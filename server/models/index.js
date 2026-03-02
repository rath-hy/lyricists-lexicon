const Word = require('./word')
const Syllable = require('./syllable')

Word.hasMany(Syllable, { foreignKey: 'word_id' })
Syllable.belongsTo(Word, { foreignKey: 'word_id' })

module.exports = { Word, Syllable }