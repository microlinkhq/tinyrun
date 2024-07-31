'use strict'

const timeSpan = require('@kikobeats/time-span')()

const forwardSignals = subprocess =>
  ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => subprocess.kill(signal))
  })

module.exports = (tasks, streams) =>
  Promise.all(
    tasks.map(task => {
      const subprocess = require('tinyspawn')(task.cmd, { shell: true })
      streams.start(subprocess, task)
      subprocess.catch(() => {})

      const duration = timeSpan()

      ;['stdout', 'stderr'].forEach(pipe =>
        subprocess[pipe].on('data', data => streams[pipe](data, task))
      )

      subprocess.on('exit', exitCode => {
        streams.exit(
          { exitCode, signalCode: subprocess.signalCode, duration: duration() },
          task
        )
      })

      forwardSignals(subprocess)

      return { name: task.name, subprocess }
    })
  )
