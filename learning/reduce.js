const fs = require('fs');
console.log("test")
let runsList = [1,2,3,4]

// console.log(runsList.reduce((accumulator,currentValue,index)=>{
//     console.log(`Accumulator ->${accumulator} Index -> ${index}`)
//     accumulator = accumulator + currentValue;
//     return accumulator;
// },0))

//List[12,3,4] return sum of two lowest numbers

// let list1 = [15, 28, 4, 2, 43]
// console.log(list1.sort((a,b)=>a-b))
// console.log(list1.sort((a,b)=>a-b).slice(0,2).reduce((acc,val)=>acc+val,0))


function sliceIntoSublistsUsingReduce(originalList, sublistSize) {
    return originalList.reduce(function(result, current, index) {
      if (index % sublistSize === 0) {
        result.push([current]);
      } else {
        result[result.length - 1].push(current);
      }
      return result;
    }, []);
  }
  
  var originalList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var sublistSize = 3;
  var listOfLists = sliceIntoSublistsUsingReduce(originalList, sublistSize);
  
  console.log(listOfLists);

  module.exports = (input) => {
    return {
      "requestId":input.requestId,
      "instance":input.instance
    };
  };

  let x = [1,2,3,4,5]

  let r = x.reduce((accessor, currentValue, index) => {
    accessor = accessor + currentValue;
    return accessor;
  },10)
  console.log(r)

  fs.readdir('./', (err, files) => {
    files.forEach(file => {
      fs.stat(`./${file}`, (err, stats) => {
        if (stats.isDirectory()) {
          console.log(`Directory: ${file}`);
        }
      });
    });
  })