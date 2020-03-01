export default async (req, res, next) => {
  res.send({
    success: true
  })
  next()
}
