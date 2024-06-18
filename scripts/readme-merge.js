import { readFile, writeFile } from 'fs'

const START_COMMENT = '<!-- START_TYPES_DOC -->'
const END_COMMENT = '<!-- END_TYPES_DOC -->'

const sourceFile = './docs/modules.md'
const destinationFile = './README.md'

readFile(sourceFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading source file: ${err}`)
    process.exit(1)
  }

  // Internal links created by typedocs point to modules.md file, instead we want to point to the hash in the same file
  const typesDocumentation = data.replace(/modules\.md#/g, '#')

  readFile(destinationFile, 'utf8', (err, destinationData) => {
    if (err) {
      console.error(`Error reading destination file: ${err}`)
      process.exit(1)
    }

    const startIndex = destinationData.indexOf(START_COMMENT)
    const endIndex = destinationData.indexOf(END_COMMENT)

    if (startIndex === -1 || endIndex === -1) {
      console.error(`Please insert ${START_COMMENT} and ${END_COMMENT} in README.md file`)
      process.exit(1)
    }

    const topREADME = destinationData.slice(0, startIndex)
    const bottomREADME = destinationData.slice(endIndex + END_COMMENT.length)

    const newContent = `${topREADME}${START_COMMENT}\n${typesDocumentation}\n${END_COMMENT}${bottomREADME}`

    writeFile(destinationFile, newContent, (err) => {
      if (err) {
        console.error(`Error writing README.md file: ${err}`)
        process.exit(1)
      }
      console.log('Types successfully copied into README.md')
    })
  })
})
