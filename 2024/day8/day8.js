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

  const oob = (y,x) => {
    if (y < 0) return true
    if (x < 0) return true
    if (y >= grid.length) return true
    if (x >= grid[y].length) return true
    return false
  }

  const antiNodes = {}

  const markAntinodes = (y1,x1,y2,x2,vector) => {
    const node1 = [y2 + vector[0], x2 + vector[1]]
    const node2 = [y1 + (vector[0] * -1), x1 + (vector[1] * -1)]
    if (!oob(node1[0], node1[1])) {
      antiNodes[JSON.stringify(node1)] = 1
    }
    if (!oob(node2[0], node2[1])) {
      antiNodes[JSON.stringify(node2)] = 1
    }
  }

  const nodes = {}

  for (const [y,row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (char !== '.') {
        if (nodes[char]) {
          nodes[char].push([y,x])
        } else {
          nodes[char] = [[y,x]]
        }
      }
    }
  }

  for (const frequency of Object.keys(nodes)) {
    for (const node1 of nodes[frequency]) {
      for (const node2 of nodes[frequency]) {
        if (JSON.stringify(node1) == JSON.stringify(node2)) continue
        const vector = [node2[0] - node1[0], node2[1] - node1[1]]
        markAntinodes(node1[0], node1[1], node2[0], node2[1], vector)
      }
    } 
  }

  console.log(Object.keys(antiNodes).length)
  const visualized = grid.slice()
    .map(( row,y ) => {
      return row.map(( col,x ) => {
        if (antiNodes[JSON.stringify([y,x])]) {
          return '#'
        }
        return col
      })
    })
  console.log(visualized.map(r => r.join(' ')).join('\n'))
}

async function part2() {
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

  const antiNodes = {}

  const markAntinodes = (y1,x1,y2,x2,vector) => {
    let n = 1
    antiNodes[JSON.stringify([y1,x1])] = 1
    antiNodes[JSON.stringify([y2,x2])] = 1
    while (true) {
      let direction1Finished = false
      let direction2Finished = false
      const node1 = [y2 + vector[0] * n, x2 + vector[1] * n]
      const node2 = [y1 + (vector[0] * -1 *n), x1 + (vector[1] * -1 * n)]
      if (!oob(node1[0], node1[1])) {
        antiNodes[JSON.stringify(node1)] = 1
      } else {
        direction1Finished = true
      }
      if (!oob(node2[0], node2[1])) {
        antiNodes[JSON.stringify(node2)] = 1
      } else {
        direction2Finished = true
      }
      if (direction1Finished && direction1Finished) break
      n++
    }
  }

  const nodes = {}

  for (const [y,row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (char !== '.') {
        if (nodes[char]) {
          nodes[char].push([y,x])
        } else {
          nodes[char] = [[y,x]]
        }
      }
    }
  }

  for (const frequency of Object.keys(nodes)) {
    for (const node1 of nodes[frequency]) {
      for (const node2 of nodes[frequency]) {
        if (JSON.stringify(node1) == JSON.stringify(node2)) continue
        const vector = [node2[0] - node1[0], node2[1] - node1[1]]
        markAntinodes(node1[0], node1[1], node2[0], node2[1], vector)
      }
    } 
  }

  console.log(Object.keys(antiNodes).length)
  const visualized = grid.slice()
    .map(( row,y ) => {
      return row.map(( col,x ) => {
        if (antiNodes[JSON.stringify([y,x])]) {
          return '#'
        }
        return col
      })
    })
  console.log(visualized.map(r => r.join(' ')).join('\n'))
}

process()
part2()
