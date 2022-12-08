import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer()

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('request.method')
  console.log(request.method)
  console.log('request.url')
  console.log(request.url)
  console.log('request.headers')
  console.log(request.headers)

  let array: any = []
  request.on('data', (chunk) => {  //当用户上传内容时触发,chunk就是上传的内容
    array.push(chunk)
  })
  request.on('end', () => {
    const body = Buffer.concat(array).toString()
    console.log('body')
    console.log(body)

    response.statusCode = 400
    response.setHeader('X-rain', 'I m rain')

    response.write('1\n')

    response.end('hi\n')
  })

})

server.listen(8888)