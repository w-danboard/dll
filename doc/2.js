const async = require('neo-async')
async.forEach([1, 2, 3], (item, done) => {
  console.log(item)
  done()
}, () => {
  console.log('over')
})