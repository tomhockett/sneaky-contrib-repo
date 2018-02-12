//@ts-check
const { join } = require('path')
const { writeFile } = require('fs')
const { promisify } = require('util')
const { exec } = require('child_process')

const execAsync = promisify(exec)
const writeFileAsync = promisify(writeFile)

function dateMinusGivenDays(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

async function touchFile(path) {
  return await writeFileAsync(path, Math.random())
}

async function addChange(change) {
  return await execAsync(`git add ${change}`)
}

async function makeCommitInPast(date, message) {
  return await execAsync(
    `GIT_AUTHOR_DATE='${date}' GIT_COMMITTER_DATE='${date}' git commit --author='BrianDGLS <briandgls92@gmail.com>' -m '${message}'`
  )
}

async function applyChanges(limit) {
  const file = join(__dirname, 'temp.txt')
  const date = dateMinusGivenDays(limit)
  await touchFile(file)
  await addChange(file)
  await makeCommitInPast(date, Math.random())
}

async function execute() {
  let count = 366
  while(count--) {
    await applyChanges(count)
  }
}

execute()
