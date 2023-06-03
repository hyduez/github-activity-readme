import * as core from '@actions/core'
import { Commander } from './commander'
import { Formatter } from './formatter'
import { Writer } from './writer'
import { CommitOpts } from '../config'

export class Action {
  public Commander = new Commander()
  public Formatter = new Formatter()
  public Writer = new Writer()

  public config: CommitOpts = {
    commit_name: core.getInput('COMMIT_NAME'),
    commit_email: core.getInput('COMMIT_EMAIL'),
    commit_msg: core.getInput('COMMIT_MSG'),
    gh_username: core.getInput('GH_USERNAME'),
    max_lines: core.getInput('MAX_LINES'),
    target_file: core.getInput('TARGET_FILE')
  }

  constructor() {
    this.Writer.run({
      opts: this.config,
      commander: this.Commander,
      formatter: this.Formatter
    })
  }
}
