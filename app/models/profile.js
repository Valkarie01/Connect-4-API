const mongoose = require('mongoose')
const matches = require('./matches')

const profileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		matches: {
			ref: matches
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Profile', profileSchema)