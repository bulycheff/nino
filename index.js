const { port } = require('./config/keys')
const app = require('./app')

app.listen(port, () => console.log(`Server started on address http://localhost:${ port }`))
