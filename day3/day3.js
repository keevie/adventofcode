const fs = require('node:fs');
const readline = require('node:readline');





async function process() {
  const fileStream = fs.createReadStream('./input');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let input = ''
  for await (const line of rl) {
    input += line
  }


  const matches = input.matchAll(/mul\(\d+,\d+\)/g)

  let total = 0
  for (const match of matches) {
    const [left, right] = match[0].matchAll(/\d+/g)
    console.log(left[0], right[0])
    total += left[0]*right[0]
  }
  console.log(total)
}


process()
