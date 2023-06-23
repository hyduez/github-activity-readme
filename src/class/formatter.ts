import { BaseUrl, Emojis, Item } from '../config'

export class Formatter {
  constructor() {}

  public EventsSerials: Record<string, (item: Item) => string> = {
    CommitCommentEvent: (item) => {
      const { x: origin } = this.parseLink(item) as { x: string }
      const repository = this.parseLink(item.repo.name)
      const action = `${Emojis.CommitCommentEventCreated} Created`
      const line = `${action} ${origin} in ${repository}`
      return line
    },
    CreateEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const type = item.payload.ref_type === 'branch'
      const action = `${type ? Emojis.CreateEventBranch : Emojis.CreateEventTag} Created`
      const line = `${action} ${origin} ${type ? 'branch' : 'tag'} in ${repository}`
      return line
    },
    DeleteEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const type = item.payload.ref_type === 'branch'
      const action = `${type ? Emojis.DeleteEventBranch : Emojis.DeleteEventTag} Deleted`
      const line = `${action} ${origin} ${type ? 'branch' : 'tag'} in ${repository}`
      return line
    },
    ForkEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const action = `${Emojis.ForkEvent} Forked`
      const line = `${action} ${repository} in ${origin}`
      return line
    },
    GollumEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const action = `${Emojis.GollumEvent} Created page`
      const line = `${action} ${origin} in ${repository}`
      return line
    },
    IssueCommentEvent: (item) => {
      const { x: origin, y: issue } = this.parseLink(item) as { x: string; y: string }
      const repository = this.parseLink(item.repo.name)
      const type: string = item.payload.action
      const localeAction = this.localeUpperCase(type)
      const action =
        type === 'created'
          ? `${Emojis.IssueCommentEventCreated} ${localeAction}`
          : type === 'deleted'
          ? `${Emojis.IssueCommentEventDeleted} ${localeAction}`
          : type === 'edited'
          ? `${Emojis.IssueCommentEventEdited} ${localeAction}`
          : type === 'changes'
          ? `${Emojis.IssueCommentEventChanges} ${localeAction}`
          : null
      const line = `${action} ${origin} at ${issue} in ${repository}`
      return line
    },
    IssuesEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const type: string = item.payload.action
      const localeAction = this.localeUpperCase(type)
      const action =
        type === 'opened'
          ? `${Emojis.IssueEventOpened} ${localeAction}`
          : type === 'edited'
          ? `${Emojis.IssueEventEdited} ${localeAction}`
          : type === 'closed'
          ? `${Emojis.IssueEventClosed} ${localeAction}`
          : type === 'reopened'
          ? `${Emojis.IssueEventReopened} ${localeAction}`
          : type === 'assigned'
          ? `${Emojis.IssueEventAssigned} ${localeAction}`
          : type === 'unassigned'
          ? `${Emojis.IssueEventUnassigned} ${localeAction}`
          : type === 'labeled'
          ? `${Emojis.IssueEventLabeled} ${localeAction}`
          : type === 'unlabeled'
          ? `${Emojis.IssueEventUnlabeled} ${localeAction}`
          : null
      const line = `${action} ${origin} in ${repository}`
      return line
    },
    PullRequestEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const type: string = item.payload.action
      const localeAction = this.localeUpperCase(type)
      const merged = item.payload.pull_request.merged
      const action = merged
        ? `${Emojis.PullRequestEventMerged} Merged`
        : type === 'opened'
        ? `${Emojis.PullRequestEventOpened} ${localeAction}`
        : type === 'edited'
        ? `${Emojis.PullRequestEventEdited} ${localeAction}`
        : type === 'closed'
        ? `${Emojis.PullRequestEventClosed} ${localeAction}`
        : type === 'reopened'
        ? `${Emojis.PullRequestEventReopened} ${localeAction}`
        : type === 'assigned'
        ? `${Emojis.PullRequestEventAssigned} ${localeAction}`
        : type === 'unassigned'
        ? `${Emojis.PullRequestEventUnassigned} ${localeAction}`
        : type === 'review_requested'
        ? `${Emojis.PullRequestEventReviewRequested} ${localeAction}`
        : type === 'review_request_removed'
        ? `${Emojis.PullRequestEventReviewRequestRemoved} ${localeAction}`
        : type === 'labeled'
        ? `${Emojis.PullRequestEventLabeled} ${localeAction}`
        : type === 'unlabeled'
        ? `${Emojis.IssueEventUnlabeled} ${localeAction}`
        : type === 'synchronize'
        ? `${Emojis.PullRequestEventSynchronize}`
        : null
      const line = `${action} ${origin} in ${repository}`
      return line
    },
    PushEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const action = `${Emojis.PushEvent} Pushed`
      const line = `${action} ${origin} in ${repository}`
      return line
    },
    ReleaseEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const type: string = item.payload.action
      const localeAction = this.localeUpperCase(type)
      const action = type === 'published' ? `${Emojis.ReleaseEventCreated} ${localeAction}` : null
      const line = `${action} ${origin} in ${repository}`
      return line
    }
  }

  private localeUpperCase = (str: string) => str.charAt(0).toLocaleUpperCase() + str.slice(1)

  private parseLink(item: Item | string) {
    if (typeof item === 'object') {
      return 'comment' in item.payload
        ? {
            x: `[comment](${item.payload.comment.html_url})`,
            y: item.payload.issue ? `[#${item.payload.issue.number}](${item.payload.issue.html_url})` : null
          }
        : 'push_id' in item.payload
        ? item.payload.size == 1
          ? `[${item.payload.commits[0].message}](${BaseUrl}/${item.repo.name}/commit/${item.payload.commits[0].sha})`
          : `[${item.payload.size} commits](${BaseUrl}/${item.repo.name}/tree/${item.payload.ref})`
        : 'ref' in item.payload
        ? `[${item.payload.ref}](${BaseUrl}/${item.repo.name}/tree/${item.payload.ref})`
        : 'forkee' in item.payload
        ? `[${item.payload.forkee.full_name}](${item.payload.forkee.html_url})`
        : 'issue' in item.payload
        ? `[#${item.payload.issue.number}](${item.payload.issue.html_url})`
        : 'pull_request' in item.payload
        ? `[#${item.payload.pull_request.number}](${item.payload.pull_request.html_url})`
        : 'release' in item.payload
        ? `[${item.payload.release.name ?? item.payload.release.tag_name}](${item.payload.release.html_url})`
        : 'pages' in item.payload
        ? `[${item.payload.pages.title}](${item.payload.pages.html_url})`
        : null
    }

    return `[${item}](${BaseUrl}/${item})`
  }
}
