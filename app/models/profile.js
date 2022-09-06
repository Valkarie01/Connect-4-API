const mongoose = require('mongoose')
const Matches = require('./matches')

const profileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		matches: {
			type: Number,
			ref: 'Matches',
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