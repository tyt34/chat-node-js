const fetch = require("node-fetch")
const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
}) 

const arrFirstName = ['Радиоактивный', 'Непомнящий', 'Большой', 'Средний', 'Маленький', 'Оранжевый', 'Ежовый', 'Ёжовый']
const arrSecondName = ['Медведь', 'Человек', 'Паук', 'Томат', 'Кетчуп', 'Урюпинец', 'Еж', 'Ёж']

const users = []

/**
 * Получить псевдо рандомное число от 0 до max.
 * max в результат не входит
 * @param max 
 * @returns 
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Подключаем клиенты
io.on('connection', (socket) => {
  console.log('connection ', socket.id)

  socket.on("give a name", () => {
    let firstName = arrFirstName[getRandomInt(arrFirstName.length)]
    let secondtName = arrSecondName[getRandomInt(arrSecondName.length)]
    console.log(' f: ', firstName)
    console.log(' s: ', secondtName)
    fetch('https://random.imagecdn.app/100/100')
    .then( (res) => {
      console.log(' res: ', res)
      let obj = {
        name: firstName + ' ' + secondtName,
        id: socket.id,
        img: res.url
      }
      users.push(obj)
      console.log(' users: ', users)
      socket.emit("give a name", obj)
      io.emit('add new user', obj)
      socket.emit("now list users", users)
    })
    .catch( (er) => {
      console.log(' er: ', er)
    })
  })

  socket.on('disconnect', () => {
    console.log('disconnected - ', socket.id)
    let indexElRemove
    let idElRemove
    users.map( (el, num) => {
      if (el.id === socket.id) {
        indexElRemove = num
        idElRemove = socket.id 
      }
    })
    users.splice(indexElRemove, 1)

    io.emit('remove user', idElRemove)
    console.log(' users: ', users)
  })
})
 
// Назначаем порт для сервера
server.listen(3000)