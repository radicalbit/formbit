import { readFile, writeFile } from 'fs'

const START_COMMENT = '<!-- START_TYPES_DOC -->'
const END_COMMENT = '<!-- END_TYPES_DOC -->'

const sourceFile = './docs/modules.md'
const destinationFile = './README.md'

// ── Category definitions ──────────────────────────────────────────────
const HERO = ['FormbitObject']

const GROUPS = [
  {
    heading: 'Core Types',
    names: ['FormbitValues', 'Form', 'InitialValues', 'Errors', 'LiveValidation', 'FormState'],
  },
  {
    heading: 'Callback Types',
    names: [
      'SuccessCallback',
      'ErrorCallback',
      'CheckSuccessCallback',
      'CheckErrorCallback',
      'SubmitSuccessCallback',
    ],
  },
  {
    heading: 'Method Types',
    names: [
      'Write',
      'WriteAll',
      'Remove',
      'RemoveAll',
      'Check',
      'Validate',
      'ValidateAll',
      'ValidateForm',
      'SubmitForm',
      'Initialize',
      'SetError',
      'SetSchema',
    ],
  },
  {
    heading: 'Options Types',
    names: ['WriteFnOptions', 'ValidateFnOptions', 'CheckFnOptions', 'WriteAllValue'],
  },
  {
    heading: 'Yup Re-Exports',
    names: ['ValidationSchema', 'ValidateOptions', 'ValidationError'],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────

/** Split the typedoc modules.md into individual type blocks */
function parseBlocks(raw) {
  // Remove the leading "## Type Aliases" heading if present
  const cleaned = raw.replace(/^## Type Aliases\s*\n/, '')

  // Split on the ___ separator that typedoc inserts between entries
  const chunks = cleaned.split(/\n___\n/)

  const blocks = []
  for (const chunk of chunks) {
    const trimmed = chunk.trim()
    if (!trimmed) continue

    // Extract the type name from the first ### heading
    const nameMatch = trimmed.match(/^### (.+)$/m)
    if (!nameMatch) continue

    blocks.push({ name: nameMatch[1], content: trimmed })
  }

  return blocks
}

/** Detect deprecated types by checking for **`Deprecated`** in content */
function isDeprecated(content) {
  return content.includes('**`Deprecated`**')
}

/** Demote ### to #### (for types inside groups) */
function demoteHeadings(content) {
  return content.replace(/^### /gm, '#### ')
}

/** Fix internal links: modules.md# -> # */
function fixLinks(content) {
  return content.replace(/modules\.md#/g, '#')
}

/** Categorize blocks into groups */
function categorize(blocks) {
  const heroBlocks = []
  const groupBuckets = GROUPS.map(() => [])
  const deprecatedBlocks = []
  const otherBlocks = []

  // Build a lookup: type name -> group index
  const nameToGroup = new Map()
  GROUPS.forEach((group, idx) => {
    for (const name of group.names) {
      nameToGroup.set(name, idx)
    }
  })

  for (const block of blocks) {
    if (HERO.includes(block.name)) {
      heroBlocks.push(block)
    } else if (isDeprecated(block.content)) {
      deprecatedBlocks.push(block)
    } else if (nameToGroup.has(block.name)) {
      groupBuckets[nameToGroup.get(block.name)].push(block)
    } else {
      otherBlocks.push(block)
    }
  }

  return { heroBlocks, groupBuckets, deprecatedBlocks, otherBlocks }
}

/** Assemble the final API Reference markdown */
function assemble(categorized) {
  const { heroBlocks, groupBuckets, deprecatedBlocks, otherBlocks } = categorized
  const sections = []

  sections.push('## API Reference\n')

  // Hero: FormbitObject stays at ### level
  for (const block of heroBlocks) {
    sections.push(fixLinks(block.content))
  }

  // Named groups
  GROUPS.forEach((group, idx) => {
    const bucket = groupBuckets[idx]
    if (bucket.length === 0) return

    sections.push(`### ${group.heading}\n`)
    for (const block of bucket) {
      sections.push(fixLinks(demoteHeadings(block.content)))
    }
  })

  // Other (fallback for any uncategorized, future-proof)
  if (otherBlocks.length > 0) {
    sections.push('### Other Types\n')
    for (const block of otherBlocks) {
      sections.push(fixLinks(demoteHeadings(block.content)))
    }
  }

  // Deprecated: wrapped in <details>
  if (deprecatedBlocks.length > 0) {
    sections.push('### Deprecated Types\n')
    sections.push('<details>\n<summary>Show deprecated types</summary>\n')
    for (const block of deprecatedBlocks) {
      sections.push(fixLinks(demoteHeadings(block.content)))
    }
    sections.push('</details>')
  }

  return sections.join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────

readFile(sourceFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading source file: ${err}`)
    process.exit(1)
  }

  const blocks = parseBlocks(data)
  const categorized = categorize(blocks)
  const typesDocumentation = assemble(categorized)

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
      console.log('Types successfully categorized and copied into README.md')
    })
  })
})
