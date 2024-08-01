'use strict'

const { listen } = require('async-listen')
const http = require('http')

const runServer = async (handler, options = {}) => {
  if (options.port === undefined) options.port = 0
  const server = http.createServer(handler)
  await listen(server, options)
  return server
}

// Create an HTTP server
const handler = (req, res) => {
  console.log(`Received request for ${req.url}`)

  // Simulate a delay in response
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, world!\n')
  }, 1000)
}

// Define a port
let port = process.env.PORT || 3000
let server

const main = async () => {
  // Start the server
  while (server === undefined) {
    try {
      server = await runServer(handler, { port })
      console.log(`Server is listening on port ${port}`)
    } catch (error) {
      if (error?.code === 'EADDRINUSE') {
        console.log(`Port \`${port}\` already in use`)
        ++port
      } else throw error
    }
  }

  // Handle graceful shutdown
  const gracefulShutdown = () => {
    console.log('Received shutdown signal, shutting down gracefully...')

    server.close(() => {
      console.log('Closed out remaining connections')
      process.exit(0)
    })

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forcing shutdown')
      process.exit(1)
    }, 10000)
  }

  // Listen for termination signals (e.g., SIGINT, SIGTERM)
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
}

main()
