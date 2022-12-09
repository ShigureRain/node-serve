import * as http from 'http'
import {IncomingMessage, ServerResponse} from 'http'
import * as fs from 'fs'
import * as p from 'path'
import * as url from 'url'

const server = http.createServer()
const publicDir = p.resolve(__dirname, 'public')  //找到public的相对路径
let cacheAge = 3600 * 24 * 365

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const {method, url: path, headers} = request
  const {pathname, search} = url.parse(path as string)

  if (method !== 'GET') {
    response.statusCode = 405
    response.end()
    return
  }

  // response.setHeader('Content-Type', 'text/html;charset=utf-8')
  let filename = pathname!.substr(1)
  if (filename === '') {
    filename = 'index.html'
  }
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if (error.errno === -4058) {
        response.statusCode = 404
        fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
          response.end(data)
        })
      } else if (error.errno === -4068) {
        response.statusCode = 403
        response.end('无权查看目录内容')
      } else {
        response.statusCode = 500
        response.end('服务器繁忙')
      }
    } else {
      //返回文件内容
      response.setHeader('Cache-Control', `public,max-age=${cacheAge}`)
      response.end(data)
    }
  })
})

server.listen(8888)