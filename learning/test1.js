const l = [1,2,3,54]
const path = '/backflipt/hemanth/1234.pdf'
const dir = path.split('/')
const fileName = dir[dir.length-1]
const dateString = new Date().toISOString().slice(0,10)
const newFileName = `${dateString}_${fileName}`
const newPath = dir.slice(0,dir.length-1).join('/') + '/' + newFileName
console.log(newPath)