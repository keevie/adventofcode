
const fs = require('node:fs');
const readline = require('node:readline');

async function process() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const input = []
  for await (const line of rl) {
    input.push(...line.split(''))
  }

  let isOn = true 

  const instructions = []
  let buffer = ''

  const checkBuffer = () => {
    if (isOn) {
      const offMatch = buffer.match(/don't\(\)/)
      if (offMatch) {
        buffer = ''
        isOn = false
        console.log('turning off')
        return
      }
      const instructionMatch = buffer.match(/mul\(\d+,\d+\)/)
      if (instructionMatch) {
        instructions.push(instructionMatch[0])
        buffer = ''
      }
    } else {
      const match = buffer.match(/do\(\)/)
      if (match) {
        isOn = true
        console.log('turning on')
        buffer = ''
      }
    }
  }

  for (const char of input) {
    buffer += char
    checkBuffer()
  }

  console.log(instructions)

  let total = 0
  for (const instruction of instructions) {
    const [left, right] = instruction.matchAll(/\d+/g)
    console.log(left[0], right[0])
    total += left[0]*right[0]
  }
  console.log(total)
}


process()
