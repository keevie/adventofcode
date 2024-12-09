const fs = require('node:fs');
const readline = require('node:readline');

const OPS = ['*', '+', '||']

async function process() {
  const filestream = fs.createReadStream('./input');
  // const filestream = fs.createReadStream('./small');

  const rl = readline.createInterface({
    input: filestream,
    crlfdelay: Infinity,
  });

  const lines = []

  for await (const line of rl) {
    const [answer, terms] = line.split(':')
    const parsed = [answer]
    parsed.push(...terms.trim().split(' '))
    lines.push(parsed)
  }

  const attemptMath = (answer, terms, operations) => {
    const expression = []
    for (let i=0;i<terms.length;i++) {
      expression.push(terms[i])
      if (operations[i] !== undefined) {
        expression.push(operations[i])
      }
    }
    // console.log(answer, expression.join(' '), eval(expression.join(' ')))
    return eval(expression.join(' ')) == parseInt(answer)
  }

  const attemptBadMath = (answer, terms, operations) => {
    const expression = []
    for (let i=0;i<terms.length;i++) {
      expression.push(terms[i])
      if (operations[i] !== undefined) {
        expression.push(operations[i])
      }
    }
    let opIdx = 0
    const total = terms.reduce((accum, curr) => {
      if (operations[opIdx] == undefined) return accum
      const op = operations[opIdx]
      let newTotal
      if (op == '||') {
        newTotal = parseInt(`${accum}${curr}`)
      } else {
        newTotal = eval(`${accum} ${op} ${curr}`)
      }
      opIdx++
      return newTotal
    })
    // console.log(answer, expression.join(' '), total)
    return total == parseInt(answer)
  }

  const validateLine = (line) => {
    const answer = line[0]
    const terms = line.slice(1)
    const numSlots = terms.length - 1
    // console.log('NUM SLOTS', numSlots)

    const base = OPS.length

    for (let i=0;i<base**numSlots;i++) {
      const baseConverted = Number(i)
        .toString(base)
      const padded = baseConverted.padStart(numSlots, '0')
      const operations = padded
        .split('')
        .map((val) => OPS[val])
      if (attemptBadMath(answer, terms, operations)) return answer
    }

    return NaN
  }

  let total = 0
  // for (const line of lines.slice(0,10)) {
  for (const line of lines) {
    const n = parseInt(validateLine(line))
    if (Number.isFinite(n)) {
      // console.log('GOT ONE')
      total +=n
    }
  }
  console.log(total)
}

process()
