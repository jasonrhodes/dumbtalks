'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const formParser = bodyParser.urlencoded({ extended: true })
const app = express()
const template = require('./lib/template')
const model = require('./lib/model')

app.use(express.static('public'))

app.get('/next', (req, res) => {
  model.getLasts((err, lasts) => {
    if (err) return res.status(400).send(err)
    res.type('text/html').send(template('next', lasts))
  })
})

app.get('/previous', (req, res) => {
  model.getLasts((err, lasts) => {
    if (err) return res.status(400).send(err)
    res.json(lasts)
  })
})

app.post('/submit', formParser, (req, res) => {
  let body = req.body
  if (body.image) model.push('images', body.image)
  if (body.word) model.push('words', body.word.split(' ').shift()) // only take the first word submitted, space-separated
  console.log('received slide from form', req.body)
  res.redirect('/next')
})

app.get('/api', (req, res) => {
  res.json({ message: 'you found the api!' })
})

app.listen(process.env.PORT || 7070)
