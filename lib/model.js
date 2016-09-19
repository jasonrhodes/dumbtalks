'use strict'

const redis = require('redis')
const client = redis.createClient(process.env.REDIS_URL || process.env.REDIS_PORT || 6379)
const _ = require('lodash')
const noCaps = ['the', 'a', 'an', 'for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'at', 'by', 'from', 'of', 'on', 'to', 'with']

const maybeCapitalize = (word) => {
  if (_.includes(noCaps, word)) return word
  return _.capitalize(word)
}

const createTitle = (words) => {
  return words.join(' ').split(' ').map(maybeCapitalize).join(' ')
}

module.exports.getLasts = (cb) => {
  client.lrange('images', -1, -1, (err, image) => {
    if (err) return cb(err)
    client.lrange('words', -3, -1, (err, words) => {
      if (err) return cb(err)
      let wordString = createTitle(words)
      cb(null, { last_image: image.pop() || '', last_words: wordString })
    })
  })
}

module.exports.getAll = (cb) => {
  client.lrange('images', 0, -1, (err, images) => {
    if (err) return cb(err)
    client.lrange('words', 0, -1, (err, words) => {
      if (err) return cb(err)
      cb(null, { images: images, words: words, title: createTitle(words) })
    })
  })
}

module.exports.push = (key, value, cb) => {
  client.rpush(key, value, cb)
}

module.exports.reset = () => {
  console.log('model reset time')
  client.del('images', 'words')
}
