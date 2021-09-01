const IPFS = require('IPFS')
async function run() {
    const node = await IPFS.create()
    
    const stream = node.cat('QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A')
    let data = ''
    
    for await (const chunk of stream) {
      // chunks of data are returned as a Buffer, convert it back to a string
      data += chunk.toString()
    }
    
    console.log(data)
}

run()