const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000
const api = require('./routes/api')

app.use(cors())

app.use(bodyParser.json())
app.use('/api', api)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log('Server app listening on port '+port+'!'))