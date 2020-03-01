export default (age = 0) => async (req, res, next) => {
  try {
    if (age === 0) {
      res.setHeader('cache-control', 'no-cache')
    } else {
      res.setHeader('cache-control', `max-age=${age}`)
    }

    next()
  } catch (error) {
    console.error(error)
    next()
  }
}
