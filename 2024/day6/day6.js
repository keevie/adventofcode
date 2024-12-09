const fs = require('node:fs');
const readline = require('node:readline');

const directions = {
  '^': [-1,0],
  '>': [0, 1],
  '<': [0, -1],
  'v': [1, 0],
}


const reverseDirections = {}
Object.keys(directions).forEach(dir => {
  reverseDirections[JSON.stringify(directions[dir])] = dir
})

const visualize = (grid, y,x, direction) => {
  const rendered = grid.slice() 
  rendered[y][x] = reverseDirections[JSON.stringify(direction)]
  console.clear()
  console.log(grid.map(r => r.join(' ')).join('\n'))
}

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

  const turnRight = (direction) => {
    const y = direction[0]
    const x = direction[1]
    return [x, y * -1]
  }

  const visited = {}

  const checkInFront = (g,y,x,direction) => {
    const frontCoords = [y + direction[0], x + direction[1]]
    if (isOutOfBounds(g,frontCoords[0], frontCoords[1])) return false
    if (g[frontCoords[0]][frontCoords[1]] == '#') {
      return true
    }
    return false
  }

  const isOutOfBounds = (g,y,x) => {
    if (y < 0) return true 
    if (x < 0) return true 
    if (y >= g.length) return true 
    if (x >= g[y].length) return true

    return false
  }

  const turnHistory = []

  const positionHistory = new Set()

  const loopDetector = (y,x,direction) => {
    const loop = positionHistory.has(JSON.stringify([y,x,direction]))
    positionHistory.add(JSON.stringify([y,x,direction]))
    // return loop
    // if (turnHistory.length < 24) return false
    // const loop = JSON.stringify(turnHistory.slice(-12)) == JSON.stringify(turnHistory.slice(-24).slice(0,12))
    // const loop = turnHistory.length > 10_000
    return loop
  }

  let looping = false
  const walk = async (g,y,x,direction) => {
    while (!isOutOfBounds(g,y,x)) {
      looping = loopDetector(y,x, direction)
      if (looping) {
          await new Promise(r => setTimeout(r, 100))
          visualize(grid,y,x,direction)
      }
      // if (loopDetector(y,x,direction)) {
      //   const frames = 1000
      //   for (let i=0;i<frames;i++) {
      //     await new Promise(r => setTimeout(r, 100))
      //     visualize(grid,y,x,direction)
      //   }
      //   // return true
      // } 
      // process.exit(0)
      if (checkInFront(g,y,x,direction)) {
        direction = turnRight(direction)
        turnHistory.push(JSON.stringify([y,x]))
      } else {
        visited[JSON.stringify([y,x])] = 1
        y+=direction[0]
        x+=direction[1]
      }
    }
    return false
  }


  const startPos = []
  let startDir

  for (const [y,row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (char in directions) {
        visited[JSON.stringify([y,x])] = 1
        startPos[0] = y
        startPos[1] = x
        startDir = directions[char]
        await walk(grid,y,x, directions[char])
        break
      }
    }
  }

  console.log("PART 1")
  console.log(Object.keys(visited).length)

  let loops = 0
  let noLoops = 0

  let loopTime = 0
  let noLoopTime = 0

  for (const [y,row] of grid.entries()) {
    for (const [x, char] of row.entries()) {
      if (char == '.') {
        turnHistory.length = 0
        positionHistory.clear()
        grid[y][x] = '#'
        start = Date.now()
        if (await walk(grid,startPos[0], startPos[1], startDir)) {
          loopTime += Date.now() - start
          loops++
        } else {
          noLoops++
          noLoopTime += Date.now() - start
        }
        grid[y][x] = '.'
      }
    }
        console.log(loops, noLoops, loops+noLoops, loopTime /1000, noLoopTime /1000)
  }

  // console.log(loops)


}

process()
