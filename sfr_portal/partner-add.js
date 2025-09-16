let partner = {"partnerName":"njfjkf","partnerWebsite":"www.google.com","partnerDescription":"","contacts":[{"role":"MFT/File Transfer Expert Contact","firstName":"firstName","lastName":"","email":"f@gmail.com","secondaryEmail":"","phone":"","isPrimary":false},{"role":"MFT/File Transfer Expert Contact","firstName":"contacts.indexx.phone","lastName":"","email":"f@gmail.com","secondaryEmail":"","phone":"","isPrimary":false}]}
let contacts = partner.contacts

function run(){
let primaryMails = contacts.filter((it)=>it.isPrimary)

let hasDuplictaes = !contacts.every(
    (it, index, contacts) =>
      contacts.findIndex((o) => o.email === it.email) === index
  )

  if (primaryMails.length === 1 && !hasDuplictaes)
  {
    return {"type":"success"}
  }
  else
  {
    let messsage = (hasDuplictaes) ? "Duplicate email found" :""
    let primaryEmailMessage = (primaryMails.length != 1) ? "Please select atleaset one primary email" : ""
    return {"type":"error","message":`${messsage} ${primaryEmailMessage}. Please check and try again`}
  }
}
console.log(run())