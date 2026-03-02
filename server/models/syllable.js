const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../util/db')

class Syllable extends Model {}

Syllable.init({
  word_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'words',
      key: 'id',
    },
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nucleus_coda_combination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'syllables',
  timestamps: false,
})

module.exports = Syllable