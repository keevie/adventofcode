const fs = require('node:fs');
const readline = require('node:readline');

async function process() {
  const fileStream = fs.createReadStream('./input');
  // const fileStream = fs.createReadStream('./small');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const grid = []

  for await (const line of rl) {
    grid.push(line.split(''))
  }

  const oob = (pos) => {
    const [y,x] = pos
    if (y < 0) return true
    if (x < 0) return true
    if (y >= grid.length) return true
    if (x >= grid[y].length) return true
    return false
  }

  const startingPositions = []

  for (const [y,row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (char == '0') {
        startingPositions.push([y,x])
      }
    }
  }

  const findNextSteps = (y,x,elevation) => {
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    const nextSteps = []

    for (const direction of directions) {
      const nextStep = [y+direction[0], x+direction[1]]
      if (!oob(nextStep) && grid[nextStep[0]][nextStep[1]] == elevation) {
        nextSteps.push(nextStep)
      }
    }
    return nextSteps
  }

  let nines = {}
  let distinct = 0
  const walk = (y,x,elevation) => {
    const nextSteps = findNextSteps(y,x,elevation)
    // console.log(nextSteps, elevation)
    if (elevation == 10) {
      nines[JSON.stringify([y,x])] = 1
      distinct++
      return
    } 
    for(const step of nextSteps) {
      walk(step[0], step[1], elevation+1)
    }
    return
  }

  let total = 0
  let distinctTotal = 0
  for (const position of startingPositions) {
    walk(position[0], position[1], 1)
    total += Object.keys(nines).length
    distinctTotal += distinct
    distinct = 0
    nines = {}
  }
  console.log(total, distinctTotal)

}
process()
