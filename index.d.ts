export interface Task {
  name: string
  cmd: string
}

export interface TaskResult {
  exitCode: number | null
  signalCode: string | null
  duration: number
}

export interface Pipes {
  stdout?: (data: string, task: Task) => void
  stderr?: (data: string, task: Task) => void
}

export interface RunOptions {
  tasks: Task[]
  childOpts?: object
  start?: (subprocess: object, task: Task) => void
  exit?: (result: TaskResult, task: Task) => void
  pipes?: Pipes
}

export default function tinyrun (options: RunOptions): Promise<{ name: string, subprocess: object }[]>
