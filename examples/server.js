const http = require('http')

// Create an HTTP server
const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`)

  // Simulate a delay in response
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, world!\n')
  }, 1000)
})

// Define a port
const PORT = process.env.PORT || 3000

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

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
