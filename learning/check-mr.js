let getEmployeeId
class backflipt{
  #empId
  constructor(name,empId=""){
    console.log(empId)
    this.name = name;
    (empId) ? this.#empId = empId : "";
  }
  static staticProperty1 = 'Property 1';
  static staticProperty2;
  static staticProperty3
  static {
    this.staticProperty2 = 'Property 2';
     getEmployeeId = (backflipt) => backflipt.#empId
  }
  getName(){
    return this.name;
  }
}

let v1 = new backflipt("v1")
console.log(v1.getName())
console.log(getEmployeeId(new backflipt('name','emp36')))