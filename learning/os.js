import { error } from 'console'
import os from 'os'
export {os}
console.log(os.freemem())
console.log("Uptime-->",os.uptime())

export const containsDuplicate = function (nums) {
    let numsWithUnique = new Set(nums);
    return nums.length !== numsWithUnique.size();
}

console.log(containsDuplicate([1,2,3,1]))