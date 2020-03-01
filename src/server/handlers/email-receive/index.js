
export const handler = (event, context) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(JSON.stringify(event))
      resolve()
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
