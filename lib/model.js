'use strict'

const redis = require('redis')
const client = redis.createClient(process.env.REDIS_URL || process.env.REDIS_PORT || 6379)
const _ = require('lodash')
const noCaps = ['the', 'a', 'an', 'for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'at', 'by', 'from', 'of', 'on', 'to', 'with']

const maybeCapitalize = (word) => {
  if (_.includes(noCaps, word)) return word
  return _.capitalize(word)
}

module.exports.getLasts = (cb) => {
  client.lrange('images', -1, -1, (err, image) => {
    if (err) return cb(err)
    client.lrange('words', -2, -1, (err, words) => {
      if (err) return cb(err)
      let wordString = words.join(' ').split(' ').map(maybeCapitalize).join(' ')
      cb(null, { last_image: image, last_words: wordString })
    })
  })
}

module.exports.push = (key, value, cb) => {
  client.rpush(key, value, cb)
}
