const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const serverDevPort = 8000
const clientDevPort = 3000

mongoose.connect(db, {
	useNewUrlParser: true,
})

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`,
	})
)

const port = process.env.PORT || serverDevPort

app.listen(port, () => {
	console.log('listening on port ' + port)
})

module.exports = app