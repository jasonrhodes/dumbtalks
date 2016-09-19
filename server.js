'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const formParser = bodyParser.urlencoded({ extended: true })
const app = express()
const template = require('./lib/template')
const model = require('./lib/model')
const auth = (req, res, next) => {
  if (!req.body.auth_key || req.body.auth_key !== process.env.TOX_AUTH_KEY) {
    return res.status(403).send('💩')
  }
  next()
}

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  model.getLasts((err, lasts) => {
    if (err) return res.status(400).send(err)
    res.type('text/html').send(template('next', lasts))
  })
})

app.get('/thanks', (req, res) => {
  res.type('text/html').send(template('thanks'))
})

app.get('/show', (req, res) => {
  model.getAll((err, all) => {
    if (err) return res.status(400).send(err)
    res.type('text/html').send(template('show', {
      access: (req.query.auth_key && req.query.auth_key === process.env.TOX_AUTH_KEY),
      images: all.images,
      title: all.title
    }))
  })
})

app.get('/lasts', (req, res) => {
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
  res.redirect('/thanks')
})

app.post('/reset', auth, (req, res) => {
  model.reset()
  res.status(200).json({ ok: '👍🤖🔥' })
})

app.get('/api', (req, res) => {
  res.json({ message: 'you found the api!' })
})

app.listen(process.env.PORT || 7070)
