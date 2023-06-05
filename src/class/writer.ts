import { Toolkit } from 'actions-toolkit'
import { readFileSync, writeFileSync } from 'node:fs'
import { CommitOpts, Item } from '../config'
import { Formatter } from './formatter'
import { Commander } from './commander'

export class Writer {
  constructor() {}

  public run(x: { opts: CommitOpts; commander: Commander; formatter: Formatter }) {
    const { opts, formatter, commander } = x
    Toolkit.run(
      async (tools) => {
        tools.log.debug(`Getting activity for ${opts.gh_username}`)
        const events = await tools.github.activity.listPublicEventsForUser({
          username: opts.gh_username,
          per_page: 100
        })
        tools.log.debug(`Activity for ${opts.gh_username}, ${events.data.length} events found.`)
        tools.log.debug(JSON.stringify(opts))

        const content = events.data
          .filter(
            (event: { type: string }) => opts.validated[event.type] === true && event.type in formatter.EventsSerials
          )
          .slice(0, opts.max_lines)
          .map((item: Item) => formatter.EventsSerials[item.type](item))

        const readmeContent = readFileSync(`./${opts.target_file}`, 'utf-8').split('\n')

        let startIdx = readmeContent.findIndex((content) => content.trim() === '<!--START_SECTION:activity-->')

        if (startIdx === -1)
          return tools.exit.failure(`Couldn't find the <!--START_SECTION:activity--> comment. Exiting!`)

        const endIdx = readmeContent.findIndex((content) => content.trim() === '<!--END_SECTION:activity-->')

        if (!content.length) tools.exit.success('No events found. Leaving README unchanged with previous activity')

        if (content.length < 5) tools.log.info('Found less than 5 activities')

        if (startIdx !== -1 && endIdx === -1) {
          startIdx++

          content.forEach((line: any, idx: number) =>
            readmeContent.splice(startIdx + idx, 0, `> - [x] ${idx + 1}. ${line}`)
          )

          readmeContent.splice(startIdx + content.length, 0, '<!--END_SECTION:activity-->')

          writeFileSync(`./${opts.target_file}`, readmeContent.join('\n'))

          try {
            await commander.commitCommand(opts)
          } catch (err) {
            tools.log.debug('Something went wrong')
            return tools.exit.failure(err)
          }
          tools.exit.success('Wrote to README')
        }

        const oldContent = readmeContent.slice(startIdx + 1, endIdx).join('\n')
        const newContent = content.map((line: any, idx: number) => `> - [x] ${idx + 1}. ${line}`).join('\n')

        if (oldContent.trim() === newContent.trim()) tools.exit.success('No changes detected')

        startIdx++

        const readmeActivitySection = readmeContent.slice(startIdx, endIdx)
        if (!readmeActivitySection.length) {
          content.some((line: any, idx: number) => {
            if (!line) {
              return true
            }

            readmeContent.splice(startIdx + idx, 0, `> - [x] ${idx + 1}. ${line}`)
          })

          tools.log.success(`Wrote to ${opts.target_file}`)
        } else {
          let count = 0

          readmeActivitySection.some((line, idx) => {
            if (!content[count]) return true

            if (line !== '') {
              readmeContent[startIdx + idx] = `> - [x] ${count + 1}. ${content[count]}`
              count++
            }
          })

          tools.log.success(`Updated ${opts.target_file} with the recent activity`)
        }

        writeFileSync(`./${opts.target_file}`, readmeContent.join('\n'))

        try {
          await commander.commitCommand(opts)
        } catch (err) {
          tools.log.debug('Something went wrong')
          return tools.exit.failure(err)
        }

        tools.exit.success('Pushed to remote repository')
      },
      {
        event: ['schedule', 'workflow_dispatch'],
        secrets: ['GITHUB_TOKEN']
      }
    )
  }
}
