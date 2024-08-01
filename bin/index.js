#!/usr/bin/env node

'use strict'

const { readFileSync } = require('node:fs')
const { styleText } = require('node:util')
const path = require('node:path')

const COLORS = ['yellow', 'blue', 'magenta', 'cyan']

const getColor = index => COLORS[index % COLORS.length]

const prettyMs = ms => {
  const seconds = ms / 1000
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.round(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds.toFixed(2)}s`
}

const toStream =
  stream =>
    (data, { name }) =>
      stream.write(split(data, name))

const split = (text, prefix) =>
  text
    .toString()
    .split('\n')
    .map(line => (line ? `${prefix} ${line}` : ''))
    .join('\n')

const { _, ...flags } = require('mri')(process.argv.slice(2))

if (_.length === 0) {
  console.log(readFileSync(path.resolve(__dirname, './help.txt'), 'utf8'))
  process.exit(0)
}

let names = flags.names?.split(',')

if (Array.isArray(names) && names.length > 0) {
  const maxNameLength = Math.max(...names.map(name => name.length))
  names = names.map(name => name.padStart(maxNameLength))
}

const tasks = _.map((cmd, index) => ({
  cmd,
  name: styleText(getColor(index), names?.[index] ?? `[${index}]`)
}))

const stdout = toStream(process.stdout)
const start = (subprocess, task) =>
  stdout(`${styleText('gray', `started pid=${subprocess.pid}`)}` + '\n', task)

const exit = ({ exitCode, signalCode, duration }, task) => {
  const color = exitCode === 0 ? 'gray' : 'red'

  console.log(
    `${task.name} ${styleText(
      color,
      `cmd='${
        task.cmd
      }' exitCode=${exitCode} signalCode=${signalCode} duration=${prettyMs(
        duration
      )}`
    )}`
  )
}

require('tinyrun')({
  tasks,
  stdout,
  stderr: toStream(process.stderr),
  start,
  exit,
  childOpts: { shell: true }
})
