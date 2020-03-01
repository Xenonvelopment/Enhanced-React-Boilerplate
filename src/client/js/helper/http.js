/* global fetch */
import url from 'url'
import getApiUrl from 'helper/get-api-url'
import generateCbUrl from './generate-cb-url'
import _ from 'lodash'

const baseUrl = getApiUrl('api')

const createFormattedUrl = (apiUrl, queryStrings, cacheBust) => {
  if (cacheBust) {
    queryStrings = {
      ...queryStrings,
      cache_bust: generateCbUrl()
    }
  }

  let parsedUrl = url.URL(apiUrl)
  parsedUrl = {
    ...parsedUrl,
    query: _.reduce(queryStrings, (result, qs, key) => {
      if (qs) {
        result = {
          ...result,
          [key]: qs
        }
      }
      return result
    }, {})
  }
  const formattedUrl = url.format(parsedUrl)
  return formattedUrl
}

export const postJson = (inputUrl, headers = {}, body = {}, returnHeaders, cacheBust) =>
  new Promise(async (resolve, reject) => {
    try {
      const myUrl = `${baseUrl}${inputUrl}`

      const response = await fetch(createFormattedUrl(myUrl, null, cacheBust), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: typeof body === 'string' ? body : JSON.stringify(body)
      })

      const json = await response.json()

      if (response.ok && returnHeaders) {
        resolve(response)
      } else if (response.ok) {
        resolve(json)
      } else {
        reject(json)
      }
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })

export const getJson = (inputUrl, headers = {}, queryStrings = {}, cacheBust = true) =>
  new Promise(async (resolve, reject) => {
    try {
      const myUrl = `${baseUrl}${inputUrl}`

      const response = await fetch(createFormattedUrl(myUrl, queryStrings, cacheBust), {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      })

      const json = await response.json()

      if (response.ok) {
        resolve(json)
      } else {
        reject(json)
      }
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })

export const putFile = (inputUrl, file, contentType) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(inputUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType
        },
        body: file
      })

      resolve(response)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
