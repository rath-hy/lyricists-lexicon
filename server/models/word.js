const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Word extends Model {}

Word.init({
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  syllable_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  onset_permutation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  onset_combination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rhyme_permutation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'words',
  timestamps: false,
})

module.exports = Word