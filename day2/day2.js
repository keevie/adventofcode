const fs = require('node:fs');
const readline = require('node:readline');

const increasing = input => {
  let prev 
  for (const n of input) {
    if (prev == undefined) {
      prev = n
      continue
    }
    if (prev <= n) return false
    prev = n
  }
  return true
}

const decreasing = input => {
  let prev 
  for (const n of input) {
    if (prev == undefined) {
      prev = n
      continue
    }
    if (prev >= n) return false
    prev = n
  }
  return true
}

const isSafe = levels => {
  if (!(increasing(levels) || decreasing(levels))) return false

  for (let i=0;i<levels.length - 1;i++) {
    const distance = Math.abs(levels[i] - levels[i+1])
    if (distance < 1 || distance > 3) return false
  }

  return true
}

const isSafeWithDamper = levels => {
  if (!isSafe(levels)) {
    for (let i=0;i<levels.length;i++) {
      if (isSafe(levels.toSpliced(i,1))) {
        return true
      }
    }
    return false
  } 
  return true
}

async function process() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let safeCount = 0
  let damperSafeCount = 0

  OUTER: for await (const line of rl) {
    const levels = line.split(/\s+/).map(n => Number(n))
    if (isSafe(levels)) {
      safeCount++
    }
    if (isSafeWithDamper(levels)) {
      damperSafeCount++
    }
  }

  console.log(safeCount)
  console.log(damperSafeCount)
}


process()
