import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  const githubToken = core.getInput('github-token', {required: true})

  if (!github.context.payload || !github.context.payload.repository) {
    throw new Error('Can only be run from within the context of GitHub Actions')
  }

  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name
  const run_id = github.context.runId

  const octokit = github.getOctokit(githubToken)

  const check_suite = await octokit.actions.getWorkflowRun({
    owner,
    repo,
    run_id
  })
  const check_run = await octokit.checks.getSuite({
    owner,
    repo,
    check_suite_id: check_suite.data.id
  })

  core.info(check_run.data.toString())
}

async function main(): Promise<void> {
  try {
    await run()
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
