const fs = require('node:fs');

const rawInput = fs.readFileSync('./input').toString()
// const rawInput = fs.readFileSync('./small').toString()

let input = []

for (const [i,num] of rawInput.toString().trim().split(' ').entries()) {
  input.push(num)
}

// input = ['125', '17']

const transform = rock => {
  if (rock == '0') {
    return ['1']
  } else if (rock.length % 2 == 0) {
    const left = parseInt(rock.slice(0, rock.length /2)).toString()
    const right = parseInt(rock.slice(rock.length/2)).toString()
    return [left, right]
  } else {
    const mult = (parseInt(rock) * 2024).toString()
    return [ mult ]
  }
}

const iters = 75

let lookup = {}

const runOperation = (rock,depth) => {
  if (depth >= iters) return 1
  if (lookup[`${rock}:${depth}`]) return lookup[`${rock}:${depth}`]

  const next = transform(rock)

  if (next.length == 1) {
    const res = runOperation(next[0], depth+1)
    lookup[`${next[0]}:${depth + 1}`] = res 
    return res
  } else if (next.length == 2) {
    const res = runOperation(next[0], depth+1) + runOperation(next[1], depth+1)
    return res
  }
}


let total = 0

for (const rock of input) {
  total += runOperation(rock,0)
}

console.log(total)
