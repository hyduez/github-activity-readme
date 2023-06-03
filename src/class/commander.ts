import { spawn } from 'node:child_process'
import { CommitOpts } from '../config'

export class Commander {
  constructor() {}

  public async commitCommand(opts: CommitOpts) {
    await this.exec('git', ['config', '--global', 'user.email', opts.commit_email])
    await this.exec('git', ['config', '--global', 'user.name', opts.commit_name])
    await this.exec('git', ['add', opts.target_file])
    await this.exec('git', ['commit', '-m', opts.commit_msg])
    await this.exec('git', ['push'])
  }

  private exec(cmd: string, args: string[] = []) {
    return new Promise((resolve, reject) => {
      const app = spawn(cmd, args, { stdio: 'pipe' })
      let stdout: string

      app.stdout.on('data', (data) => {
        stdout = data
      })

      app.on('close', (code) => {
        if (code !== 0 && !stdout.includes('nothing to commit')) {
          const err = new Error(`Invalid status code: ${code}`)
          return reject(err)
        }
        return resolve(code)
      })

      app.on('error', reject)
    })
  }
}
