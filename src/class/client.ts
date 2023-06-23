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
    max_lines: parseInt(core.getInput('MAX_LINES')),
    target_file: core.getInput('TARGET_FILE'),
    validated: {
      CommitCommentEvent: core.getInput('EVENT_COMMIT_COMMENT').toLowerCase() === 'true',
      CreateEvent: core.getInput('EVENT_CREATE').toLowerCase() === 'true',
      DeleteEvent: core.getInput('EVENT_DELETE').toLowerCase() === 'true',
      ForkEvent: core.getInput('EVENT_FORK').toLocaleLowerCase() === 'true',
      IssueCommentEvent: core.getInput('EVENT_ISSUE_COMMENT').toLocaleLowerCase() === 'true',
      IssuesEvent: core.getInput('EVENT_ISSUES').toLowerCase() === 'true',
      PullRequestEvent: core.getInput('EVENT_PULL_REQUEST').toLowerCase() === 'true',
      PushEvent: core.getInput('EVENT_PUSH').toLocaleLowerCase() === 'true',
      ReleaseEvent: core.getInput('EVENT_RELEASE').toLowerCase() === 'true'
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
