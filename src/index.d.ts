import { ChildProcess } from 'child_process'

export interface TinyrunTask {
  name: string
  cmd: string
}

export interface TinyrunChildOpts {
  cwd?: string
  env?: Record<string, string>
  shell?: boolean
}

export interface TinyrunExitInfo {
  exitCode: number | null
  signalCode: string | null
  duration: number
}

export interface TinyrunResult {
  name: string
  subprocess: ChildProcess
}

export interface TinyrunPipes {
  stdout?: (data: Buffer, task: TinyrunTask) => void
  stderr?: (data: Buffer, task: TinyrunTask) => void
}

export interface TinyrunOptions {
  tasks: TinyrunTask[]
  childOpts?: TinyrunChildOpts
  start?: (subprocess: ChildProcess, task: TinyrunTask) => void
  exit?: (info: TinyrunExitInfo, task: TinyrunTask) => void
  pipes?: TinyrunPipes
}

export default function tinyrun(options: TinyrunOptions): Promise<TinyrunResult[]>
