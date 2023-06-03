import { BaseUrl, Emojis, Item } from '../config'

export class Formatter {
  constructor() {}

  public EventsSerials: Record<string, (item: Item) => string> = {
    CommitCommmentEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const action = item.payload.action === 'created' ? `${Emojis.CommitCommentEventCreated} Commented` : null
      const line = `> ${action} on ${origin} in ${repository}`
      return line
    },
    IssuesEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const localeAction = this.localeUpperCase(item.payload.action)
      const action =
        item.payload.action === 'opened'
          ? `${Emojis.IssueEventOpened} ${localeAction}`
          : item.payload.action === 'edited'
          ? `${Emojis.IssueEventEdited} ${localeAction}`
          : item.payload.action === 'closed'
          ? `${Emojis.IssueEventClosed} ${localeAction}`
          : item.payload.action === 'reopened'
          ? `${Emojis.IssueEventReopened} ${localeAction}`
          : item.payload.action === 'assigned'
          ? `${Emojis.IssueEventAssigned} ${localeAction}`
          : item.payload.action === 'unassigned'
          ? `${Emojis.IssueEventUnassigned} ${localeAction}`
          : item.payload.action === 'labeled'
          ? `${Emojis.IssueEventLabeled} ${localeAction}`
          : item.payload.action === 'unlabeled'
          ? `${Emojis.IssueEventUnlabeled} ${localeAction}`
          : null
      const line = `> ${action} ${origin} in ${repository}`
      return line
    },
    PullRequestEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const localeAction = this.localeUpperCase(item.payload.action)
      const action = item.payload.pull_request.merged
        ? `${Emojis.PullRequestEventMerged} Merged`
        : item.payload.action === 'opened'
        ? `${Emojis.PullRequestEventOpened} ${localeAction}`
        : item.payload.action === 'edited'
        ? `${Emojis.PullRequestEventEdited} ${localeAction}`
        : item.payload.action === 'closed'
        ? `${Emojis.PullRequestEventClosed} ${localeAction}`
        : item.payload.action === 'reopened'
        ? `${Emojis.PullRequestEventReopened} ${localeAction}`
        : item.payload.action === 'assigned'
        ? `${Emojis.PullRequestEventAssigned} ${localeAction}`
        : item.payload.action === 'unassigned'
        ? `${Emojis.PullRequestEventUnassigned} ${localeAction}`
        : item.payload.action === 'review_requested'
        ? `${Emojis.PullRequestEventReviewRequested} ${localeAction}`
        : item.payload.action === 'review_request_removed'
        ? `${Emojis.PullRequestEventReviewRequestRemoved} ${localeAction}`
        : item.payload.action === 'labeled'
        ? `${Emojis.PullRequestEventLabeled} ${localeAction}`
        : item.payload.action === 'unlabeled'
        ? `${Emojis.IssueEventUnlabeled} ${localeAction}`
        : item.payload.action === 'synchronize'
        ? `${Emojis.PullRequestEventSynchronize}`
        : null
      const line = `> ${action} ${origin} in ${repository}`
      return line
    },
    ReleaseEvent: (item) => {
      const origin = this.parseLink(item)
      const repository = this.parseLink(item.repo.name)
      const localeAction = this.localeUpperCase(item.payload.action)
      const action = item.payload.action === 'published' ? `${Emojis.ReleaseEventCreated} ${localeAction}` : null
      const line = `${action} ${origin} in ${repository}`
      return line
    }
  }

  private localeUpperCase = (str: string) => str.charAt(0).toLocaleUpperCase() + str.slice(1)

  private parseLink(item: Item | string) {
    if (typeof item === 'object') {
      const url: string = item.payload.html_url ?? null
      return 'comment' in item.payload
        ? `[${item.payload.comment.path}](${url})`
        : 'issue' in item.payload
        ? `[#${item.payload.issue.number}](${url})`
        : 'pull_request' in item.payload
        ? `[#${item.payload.pull_request.number}](${url})`
        : 'release' in item.payload
        ? `[${item.payload.release.name ?? item.payload.release.tag_name}](${url})`
        : null
    }

    return `[${item}](${BaseUrl}/${item})`
  }
}
