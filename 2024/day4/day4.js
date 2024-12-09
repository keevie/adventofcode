const fs = require('node:fs');
const readline = require('node:readline');

async function process() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const grid = []

  for await (const line of rl) {
    grid.push(line.split(''))
  }

  let total = 0

  const vectors = [
    [0,1],
    [0,-1],
    [1,0],
    [1,1],
    [1,-1],
    [-1,0],
    [-1,1],
    [-1,-1],
  ]
  const XMAS = 'XMAS'

  const search = (x,y) => {
    OUTER: for (const vector of vectors) {
      const pos = [x,y]
      for (let i=0;i<XMAS.length;i++) {
        try {
          if (grid[pos[0]][pos[1]] != XMAS[i]) continue OUTER
        } catch(e) {
          continue OUTER
        }
        pos[0] += vector[0]
        pos[1] += vector[1]
      }
      total++
    }
  }

  for (const [x,row] of grid.entries()) {
    for (const [y, char] of row.entries()) {
      if (char == 'X') {
        search(x,y)
      }
    }
  }
  console.log(total)

}

async function part2() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const grid = []

  for await (const line of rl) {
    grid.push(line.split(''))
  }

  let total = 0

  const search = (x,y) => {
    try {
      if (grid[x+1][y+1] !== 'A') return

      const firstHalf = [grid[x][y], grid[x+2][y+2]]
      if (firstHalf.sort().join('') != 'MS') return
      const secondHalf = [grid[x+2][y], grid[x][y+2]]
      if (secondHalf.sort().join('') != 'MS') return

      console.log([
        grid[x].slice(y,y+3),
        grid[x+1].slice(y, y+3),
        grid[x+2].slice(y,y+3),
      ].join('\n'))
      console.log('\n')
      total++
    } catch(e) {
    }
  }

  for (const [x,row] of grid.entries()) {
    for (const [y, char] of row.entries()) {
      if (['M','S'].includes(char)) {
        search(x,y)
      }
    }
  }
  console.log(total)

}


// process()
part2()
