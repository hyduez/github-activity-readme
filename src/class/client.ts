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
    commit_name: this.get('COMMIT_NAME'),
    commit_email: this.get('COMMIT_EMAIL'),
    commit_msg: this.get('COMMIT_MSG'),
    gh_username: this.get('GH_USERNAME'),
    target_file: this.get('TARGET_FILE'),
    validated: {
      CommitCommentEvent: this.check('EVENT_COMMIT_COMMENT'),
      CreateEvent: this.check('EVENT_CREATE'),
      DeleteEvent: this.check('EVENT_DELETE'),
      ForkEvent: this.check('EVENT_FORK'),
      GollumEvent: this.check('EVENT_GOLLUM'),
      IssueCommentEvent: this.check('EVENT_ISSUE_COMMENT'),
      IssuesEvent: this.check('EVENT_ISSUES'),
      PullRequestEvent: this.check('EVENT_PULL_REQUEST'),
      PushEvent: this.check('EVENT_PUSH'),
      ReleaseEvent: this.check('EVENT_RELEASE'),
      WatchEvent: this.check('EVENT_WATCH')
    }
  }

  constructor() {
    this.Writer.run({
      opts: this.config,
      commander: this.Commander,
      formatter: this.Formatter
    })
  }

  private get(str: string) {
    return core.getInput(str)
  }

  private check(name: string) {
    return this.get(name).toLocaleLowerCase() === 'true'
  }
}
