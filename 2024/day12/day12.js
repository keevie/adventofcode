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

  let visited = {}

  const validNextPartOfArea = (y,x,char) => {
    return !oob(y,x) && grid[y][x] == char && !visited[JSON.stringify([y,x])]
  }

  const patches = []

  const search = (y,x,char) => {
    const stack = [[y,x]]
    let area = 0
    let perimiter = 0

    const patch = {
      char,
      spaces: [],
    }
    while (stack.length) {
      let p = 4
      const currentPosition = stack.pop()
      if ( visited[JSON.stringify(currentPosition)] ) continue
      patch.spaces.push(currentPosition)
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
    patches.push(patch)
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
  console.log('cost part 1', totalCost)
  visited = {}

  const findAdjacentEdges = (edges, edge, orientation) => {
    const side = []

    if (orientation == 'h') {
      let direction = 'right'

      let nextEdge = {
        side: edge.side,
        pos: edge.pos,
      }

      while (true) {
        if (direction == 'right') {
          nextEdge = {
            side: edge.side,
            pos: [nextEdge.pos[0], nextEdge.pos[1] + 1],
          }
          const found = edges.find(e => e.side == nextEdge.side && e.pos[0] == nextEdge.pos[0] && e.pos[1] == nextEdge.pos[1])
          if (found) {
            side.push(found)
          } else {
            direction = 'left'
            nextEdge = edge
          }
        } else {
          nextEdge = {
            side: edge.side,
            pos: [nextEdge.pos[0], nextEdge.pos[1] - 1],
          }
          const found = edges.find(e => e.side == nextEdge.side && e.pos[0] == nextEdge.pos[0] && e.pos[1] == nextEdge.pos[1])
          if (found) {
            side.push(found)
          } else {
            break
          }
        }
      }
    } else if (orientation = 'v') {
      let direction = 'down'

      let nextEdge = {
        side: edge.side,
        pos: edge.pos,
      }

      while (true) {
        if (direction == 'down') {
          nextEdge = {
            side: edge.side,
            pos: [nextEdge.pos[0] + 1, nextEdge.pos[1]],
          }
          const found = edges.find(e => e.side == nextEdge.side && e.pos[0] == nextEdge.pos[0] && e.pos[1] == nextEdge.pos[1])
          if (found) {
            side.push(found)
          } else {
            direction = 'up'
            nextEdge = edge
          }
        } else {
          nextEdge = {
            side: edge.side,
            pos: [nextEdge.pos[0] - 1, nextEdge.pos[1]],
          }
          const found = edges.find(e => e.side == nextEdge.side && e.pos[0] == nextEdge.pos[0] && e.pos[1] == nextEdge.pos[1])
          if (found) {
            side.push(found)
          } else {
            break
          }
        }
      }

    }
    return side
  }


  let totalPrice2 = 0

  for (const patch of patches) {
    let sideCount = 0
    const edges = []

    for (const space of patch.spaces) {
      for (const dir of directions) {
        if (!validNextPartOfArea(space[0] + dir[0], space[1] + dir[1], patch.char)) {
          edges.push({
            side: dir,
            pos: [space[0] + dir[0], space[1] + dir[1]],
          })
        }
      }
    }

    const usedEdges = {}

    for (const edge of edges) {
      if (usedEdges[JSON.stringify(edge)]) continue
      const orientation = edge.side[0] != 0 ? 'h' : 'v'// if we look up from the center of a box, the edge we see is horizontal
      const side = findAdjacentEdges(edges, edge, orientation)
      for (const e of side) {
        usedEdges[JSON.stringify(e)] = 1
      }
      sideCount++
    }
    totalPrice2 += sideCount * patch.spaces.length
  }
  console.log('part 2', totalPrice2)
}

process()
