const mongoose = require('mongoose')
const profile = require('./profile')

const matchesSchema = new mongoose.Schema(
	{
		player1: {
			type: String,
			ref: Profile,
			required: true,
		},
		player2: {
			type: String,
			ref: profile,
			required: true,
		},
		rounds: {
			type: Number,
			Enumerator: 1 || 3, 
		},
		roundHistory: {
			type: [String],
		}, 
		isDone: {
			type: Boolean,
		}, 
		winner: {
			type: String,
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

module.exports = mongoose.model('Match', matchesSchema)