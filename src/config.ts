export const BaseUrl = 'https://github.com'

export enum Emojis {
  CommitCommentEventCreated = '💬',
  CreateEventBranch = '🌱',
  CreateEventTag = '🔖',
  DeleteEventBranch = '🗑️',
  DeleteEventTag = '🗑️🔖',
  ForkEvent = '🍽',
  GollumEvent = '📚',
  IssueCommentEventCreated = '💬',
  IssueCommentEventEdited = '✏️💬',
  IssueCommentEventDeleted = '🗑️💬',
  IssueCommentEventChanges = '🔄💬',
  IssueEventOpened = '🚀',
  IssueEventEdited = '✏️🚀',
  IssueEventClosed = '❌',
  IssueEventReopened = '🔓',
  IssueEventAssigned = '👥✅',
  IssueEventUnassigned = '👥❌',
  IssueEventLabeled = '🏷️✅',
  IssueEventUnlabeled = '🏷️❌',
  MemberEventAdded = '👥', // pending bc yes
  PullRequestEventOpened = '🌟',
  PullRequestEventEdited = '✏️🌟',
  PullRequestEventClosed = '🛑',
  PullRequestEventReopened = '🔓',
  PullRequestEventAssigned = '👥✅',
  PullRequestEventUnassigned = '👥❌',
  PullRequestEventReviewRequested = '👀✅',
  PullRequestEventReviewRequestRemoved = '👀❌',
  PullRequestEventLabeled = '🏷️✅',
  PullRequestEventUnlabeled = '🏷️❌',
  PullRequestEventSynchronize = '📦',
  PullRequestEventMerged = '🎉',
  PullRequestReviewEventCreated = '👀',
  PullRequestReviewCommentEventCreated = '💬👀',
  PullRequestReviewCommentEventChanges = '🔄💬👀',
  PullRequestReviewThreadEventResolved = '✅👀',
  PullRequestReviewThreadEventUnresolved = '❌👀',
  PushEvent = '🍤',
  ReleaseEventCreated = '🚀',
  ReleaseEventChanges = '🔄🚀',
  SponsorshipEventCreated = '💖', // pending bc yes
  WatchEventStarted = '⭐'
}

export interface CommitOpts {
  commit_email: string
  commit_msg: string
  commit_name: string
  gh_username: string
  target_file: string
  validated: Record<string, boolean>
}

export interface Item {
  type: string
  payload: any
  repo: {
    name: string
  }
}
