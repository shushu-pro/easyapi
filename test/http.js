import easyapi from '../src/index'
import http from 'http'
import querystring from 'querystring'

const server = http.createServer(function (req, res) {
  const outJSON = (data) => res.end(JSON.stringify(data == null ? {} : data))
  const params = querystring.parse(req.url.match(/^[^?]*\?(.*)/)[1])
  setTimeout(() => {
    switch (params.cmd) {
      case 'http200': {
        return outJSON(params)
      }
      case 'http404': {
        res.statusCode = 404
        return res.end()
      }
      case 'http999': {
        return
      }
      default: {
        console.error(`unhandle request ${JSON.stringify(params)}`)
      }
    }
  }, params.ms || 0)
})

export default {
  start,
  close,
  create,
}

function start () {
  server.listen(4444)
}

function close () {
  server.close()
}

function create (code, option) {
  if (option === undefined) {
    option = code
    code = 200
  }
  return easyapi({
    baseURL: 'http://localhost:4444/',
    ...option,
    configs: {
      test: { url: `?cmd=http${code}`, ...option.config },
      ...option.configs,
    },
  })
}
