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

  const oob = (y,x) => {
    if (y < 0) return true
    if (x < 0) return true
    if (y >= grid.length) return true
    if (x >= grid[y].length) return true
    return false
  }

  const directions = [
    [-1,0],
    [0, 1],
    [0, -1],
    [1, 0],
  ]

  const visited = {}

  const validNextPartOfArea = (y,x,char) => {
    return !oob(y,x) && grid[y][x] == char && !visited[JSON.stringify([y,x])]
  }

  const search = (y,x,char) => {
    const stack = [[y,x]]
    let area = 0
    let perimiter = 0

    while (stack.length) {
      let p = 4
      const currentPosition = stack.pop()
      if ( visited[JSON.stringify(currentPosition)] ) continue
      area++
      visited[JSON.stringify(currentPosition)] = 1

      for (const dir of directions) {
        const next = [currentPosition[0] + dir[0], currentPosition[1] + dir[1]]
        if (validNextPartOfArea(next[0], next[1], char)) {
          stack.push(next)
          p-=2
        }
      }
      perimiter += p
    }
    console.log(char, area,perimiter)
    return area*perimiter
  }

  let totalCost = 0

  for (const [y,row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (visited[JSON.stringify([y,x])]) continue
      const cost = search(y,x,char)
      totalCost += cost
    }
  }
  console.log(totalCost)
}

process()
