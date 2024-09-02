import { Toolkit } from 'actions-toolkit'
import { readFileSync, writeFileSync } from 'node:fs'
import { CommitOpts, Item } from '../config'
import { Formatter } from './formatter'
import { Commander } from './commander'

// this is pending to refactor (date: 7-7-23)
// i wont refactor it (date: 9-1-24)

export class Writer {
  constructor() {}

  public async run(x: { opts: CommitOpts; commander: Commander; formatter: Formatter }) {
    const { opts, formatter, commander } = x
    const tools = new Toolkit()

    try {
      tools.log.debug(`Getting activity for ${opts.gh_username}`)

      const events = await tools.github.activity.listPublicEventsForUser({
        username: opts.gh_username,
        per_page: 100
      })

      tools.log.debug(`Activity for ${opts.gh_username}, ${events.data.length} events found.`)
      tools.log.debug(JSON.stringify(opts))

      const content: string[] = events.data
        .filter((event: { type: string }) => opts.validated[event.type] && event.type in formatter.EventsSerials)
        .slice(0, 5)
        .map((item: Item) => formatter.EventsSerials[item.type](item))

      const readme = readFileSync(`./${opts.target_file}`, 'utf-8').split('\n')

      let startIdx = readme.findIndex((content) => content.trim() === '<!--START_SECTION:activity-->')

      if (startIdx === -1)
        return tools.exit.failure(`Couldn't find the <!--START_SECTION:activity--> comment. Exiting!`)

      const endIdx = readme.findIndex((content) => content.trim() === '<!--END_SECTION:activity-->')

      if (!content.length) return tools.exit.success('No events found. Leaving README unchanged with previous activity')
      if (content.length < 5) tools.log.info('Found less than 5 activities')

      if (startIdx !== -1 && endIdx === -1) {
        startIdx++

        content.forEach((line, idx) => readme.splice(startIdx + idx, 0, `- ${line}`))

        readme.splice(startIdx + content.length, 0, '<!--END_SECTION:activity-->')

        writeFileSync(`./${opts.target_file}`, readme.join('\n'))

        await commander.commitCommand(opts)
        return tools.exit.success('Wrote to README')
      }

      const oldContent = readme.slice(startIdx + 1, endIdx).join('\n')
      const newContent = content.map((line, _idx) => `- ${line}`).join('\n')

      if (oldContent.trim() === newContent.trim()) return tools.exit.success('No changes detected')

      startIdx++

      const readmeActivitySection = readme.slice(startIdx, endIdx)

      if (!readmeActivitySection.length) {
        content.some((line, idx) => {
          if (!line) {
            return true
          }

          readme.splice(startIdx + idx, 0, `- ${line}`)
        })

        tools.log.success(`Wrote to ${opts.target_file}`)
      } else {
        let count = 0

        readmeActivitySection.some((line, idx) => {
          if (!content[count]) return true

          if (line !== '') {
            readme[startIdx + idx] = `- ${content[count]}`
            count++
          }
        })

        tools.log.success(`Updated ${opts.target_file} with the recent activity`)
      }

      writeFileSync(`./${opts.target_file}`, readme.join('\n'))

      await commander.commitCommand(opts)
      tools.exit.success('Pushed to remote repository')
    } catch (err) {
      tools.log.debug('Something went wrong')
      tools.exit.failure(err)
    }
  }
}
