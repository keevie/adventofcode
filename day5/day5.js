const fs = require('node:fs');
const readline = require('node:readline');

async function process() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rulesInput = []
  const updates = []

  let doneReadingRules = false
  for await (const line of rl) {
    if (doneReadingRules) {
      updates.push(line)
    } else {
      if (line.trim() == "") {
        doneReadingRules = true
      } else {
        rulesInput.push(line)
      } 
    }
  }

  const rules = {}

  for (const rule of rulesInput) {
    const [before, after] = rule.split('|') 
    if (rules[before]) {
      rules[before].push(after)
    } else {
      rules[before] = [after]
    }
  }

  const middlePages = []

  const part2Pages = []

  for (const update of updates) {
    const pages = update.split(',').map(Number)
    const sorted = pages.toSorted((a,b) => {
      const rule = rules[a.toString()]
      if (rule.includes(b.toString())) {
        return -1
      }
      return 0
    })

    if (JSON.stringify(pages) == JSON.stringify(sorted)) {
      middlePages.push(pages[Math.floor(pages.length/2)])
    } else {
      part2Pages.push(sorted[Math.floor(sorted.length/2)])
    }
  }

  const total = middlePages.reduce((a,b) => a+b)
  const part2Total = part2Pages.reduce((a,b) => a+b)

  console.log(total)
  console.log(part2Total)

}

process()

