'use strict'

const _ = require('lodash')
const fs = require('fs')
const getTemplateFunc = _.memoize((name) => {
  let tmplString = fs.readFileSync(`templates/${name}.html`)
  return _.template(tmplString)
})

module.exports = (name, pageName, data) => {
  if (!pageName || typeof pageName === 'object' && !data) {
    data = pageName || {}
    pageName = 'default'
  }
  let page = getTemplateFunc(`pages/${pageName}`)(data)
  return page.replace(/{{ content }}/, getTemplateFunc(name)(data))
}
