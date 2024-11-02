const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.sendFile("views/index.html", {root: __dirname})
})

app.listen(port, () => {
  console.log(`MyoSense server runing on port ${port}`)
})