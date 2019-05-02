const express = require('express')
const { printFetch } = require('./scb.js')
var cors = require('cors')

const app = express()
app.use(cors())
const port = 8080;

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile('./public/index.html'))
app.get('/test', async (req, res) => {
  const data = await printFetch();
  res.send(data);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))