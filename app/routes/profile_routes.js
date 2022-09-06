// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

const Profile = require('../models/profile')

// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership


const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /profiles
router.get('/profiles', requireToken, (req, res, next) => {
	Profile.find()
		.then((profiles) => {
			// `examples` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return profiles.map((profile) => profile.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((profile) => res.status(200).json({ profile: profile }))
		
		.catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/profiles/:id', requireToken, (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Profile.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON
		.then((profile) => res.status(200).json({ profile: profile.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /examples
router.post('/profiles', requireToken, (req, res, next) => {
	// set owner of new example to be current user
	req.body.profile.owner = req.user.id

	Profile.create(req.body.profile)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((profile) => {
			res.status(201).json({ profile: profile.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/profiles/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.profile.owner

	Profile.findById(req.params.id)
		.then(handle404)
		.then((profile) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, profile)

			// pass the result of Mongoose's `.update` to the next `.then`
			return profile.updateOne(req.body.profile)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /profiles/5a7db6c74d55bc51bdf39793
router.delete('/profiles/:id', requireToken, (req, res, next) => {
	Profile.findById(req.params.id)
		.then(handle404)
		.then((profile) => {
			requireOwnership(req, profile)
			profile.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router