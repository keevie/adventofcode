const fs = require('node:fs');
const readline = require('node:readline');

async function process() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const left = []
  const right = []
  for await (const line of rl) {
    const[l,r] = line.split(/\s+/)
    left.push(Number(l))
    right.push(Number(r))
  }
  left.sort()
  right.sort()


  let sum=0
  for (let i=0; i<left.length;i++) {
    sum+=Math.abs(left[i]-right[i])
  }
  console.log('PART1', sum)

  let part2Sum = 0
  for (let i=0;i<left.length;i++) {
    const freq = right.reduce((accum,curr) => (curr == left[i] ? accum + 1 : accum), 0)
    part2Sum+= left[i]*freq
  }
  console.log('PART2', part2Sum)
}


process()
