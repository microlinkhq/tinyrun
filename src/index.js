'use strict'

const timeSpan = require('@kikobeats/time-span')()

const forwardSignals = subprocess =>
  ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => subprocess.kill(signal))
  })

module.exports = ({ tasks, childOpts, start, exit, ...pipes }) =>
  Promise.all(
    tasks.map(task => {
      const subprocess = require('tinyspawn')(task.cmd, childOpts)
      start(subprocess, task)
      subprocess.catch(() => {})

      const duration = timeSpan()

      ;['stdout', 'stderr'].forEach(pipe =>
        subprocess[pipe]
          .on('data', data => pipes[pipe](data, task))
          .on('end', () => pipes[pipe]('', task))
      )

      subprocess.once('exit', async exitCode => {
        exit(
          { exitCode, signalCode: subprocess.signalCode, duration: duration() },
          task
        )
      })

      forwardSignals(subprocess)

      return { name: task.name, subprocess }
    })
  )
