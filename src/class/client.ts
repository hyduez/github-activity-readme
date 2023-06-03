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
    target_file: core.getInput('TARGET_FILE'),
    validated: {
      CommitCommentEvent: Boolean(core.getInput('EVENT_COMMIT_COMMENT')),
      CreateEvent: Boolean(core.getInput('EVENT_CREATE')),
      DeleteEvent: Boolean(core.getInput('EVENT_DELETE')),
      IssuesEvent: Boolean(core.getInput('EVENT_ISSUES')),
      PullRequestEvent: Boolean(core.getInput('EVENT_PULL_REQUEST')),
      ReleaseEvent: Boolean(core.getInput('EVENT_RELEASE'))
    }
  }

  constructor() {
    this.Writer.run({
      opts: this.config,
      commander: this.Commander,
      formatter: this.Formatter
    })
  }
}
