const fs = require('node:fs');

const rawInput = fs.readFileSync('./input').toString()
// const rawInput = fs.readFileSync('./small')
//
const computeChecksum = (input) => {
  let total = 0
  for (let i=0;i<input.length;i++) {
    if (input[i] == '.') continue
    total+=i*input[i]
  }
  return total
}

const translateInput = (raw) => {
  const input = []

  let id=0
  let isFreeSpace = false

  for (const [i,num] of rawInput.toString().trim().split('').entries()) {
    const int = parseInt(num)
    if (isFreeSpace) {
      for (let j=0;j<int;j++) {
        input.push('.')
      }
    } else {
      for (let j=0;j<int;j++) {
        input.push(id)
      }
      id++
    }
    isFreeSpace = !isFreeSpace
  }
  return input
}

const part1 = () => {
  const input = translateInput(rawInput)

  for (let i=input.length-1; i>=0;i--) {
    if (input[i] != '.') {
      let foundNewPlacement = false
      for (let j = 0; j<i;j++) {
        if (input[j] == '.') {
          foundNewPlacement = true
          input[j] = input[i]
          input[i] = '.'
          break
        }
      }
      if (!foundNewPlacement) break
    }
  }
  console.log(computeChecksum(input))
}

const findBlockSize = (input, cursor, val) => {
  let length = 0
  for (let i=cursor; i>=0;i--) {
    if (input[i] == val) {
      length++
    } else {
      break
    }
  }
  return length
}

const checkForAvailableRoom = (input, cursor, blockSize) => {
  for (let i=cursor;i<cursor+blockSize;i++) {
    if (input[i] != '.') {
      return false
    }
  }

  return true
}

const blocksAttempted = {}

const part2 = () => {
  const input = translateInput(rawInput)

  for (let i=input.length-1; i>=0;i--) {
    if (input[i] != '.') {
      const valAsString = input[i].toString()
      if (blocksAttempted[valAsString]) continue
      const blockSize = findBlockSize(input, i, input[i])
      // console.log(blockSize, valAsString)
      for (let j = 0; j<i;j++) {
        if (checkForAvailableRoom(input, j, blockSize)) {
          foundNewPlacement = true
          input.splice(j,blockSize,...new Array(blockSize).fill(input[i]))
          input.splice(i-blockSize + 1,blockSize,...new Array(blockSize).fill('.')) //yikes
          break
        }
      }
      blocksAttempted[valAsString] = 1
    }
  }

  console.log(input.join(' '))
  console.log(computeChecksum(input))
}
part2()
