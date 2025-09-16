interface User {
    id: number
    firstName: string
    lastName: string
    role: string
  }
   
const user = {"id":1,"firstName":"John","lastName":"Doe","role":"admin"} as User;

console.log(`User ID: ${user.id}`);