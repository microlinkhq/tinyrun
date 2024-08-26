'use strict'

const test = require('ava')

const noop = () => {}

const tinyrun = require('tinyrun')

test('run multiple tasks', async t => {
  const durations = []

  const promises = await tinyrun({
    tasks: [
      { name: 'task1', cmd: 'sleep 1 && echo foo' },
      { name: 'task2', cmd: 'echo bar' }
    ],
    stdout: noop,
    stderr: noop,
    start: noop,
    exit: ({ duration }, task) => durations.push({ name: task.name, duration }),
    childOpts: { shell: true }
  })

  t.true(Array.isArray(promises))
  t.is(promises.length, 2)
  t.is(promises[0].name, 'task1')
  t.is(promises[1].name, 'task2')

  t.true(promises[0].subprocess instanceof Promise)
  t.true(promises[1].subprocess instanceof Promise)

  const resolved = await Promise.resolve(promises).then(async tasks => {
    return Promise.all(
      tasks.map(async task => {
        task.subprocess = await task.subprocess
        return task
      })
    )
  })

  t.is(resolved[0].subprocess.stdout, 'foo')
  t.is(resolved[1].subprocess.stdout, 'bar')
  t.true(durations[1].duration >= 1000)
})

test('prefixing handles line segments', t => {
  const { execSync } = require('child_process')

  let program = `
    process.stdout.write('hello ', () => {
      process.stdout.write('world\\n', () => {
        process.stdout.write('nice to meet you')
      })
    })
  `

  program = program.replace(/\\/g, '\\\\')
  program = `node -e "${program}"`
  program = program.replace(/"/g, '\\"')

  let stdout = execSync(`./bin/index.js "${program}" --names "foo"`, {
    encoding: 'utf-8',
    stdio: 'pipe'
  })

  // strip pid from stdout
  stdout = stdout.replace(/pid=\d+/gm, 'pid=0')
  // strip ansi from stdout
  stdout = stdout.replace(/\u001b\[\d+m/g, '') // eslint-disable-line

  t.snapshot(stdout)
})
