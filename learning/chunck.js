let data = [{"OID":52001},{"OID":52002},{"OID":52003},{"OID":52004},{"OID":52005},{"OID":52006},{"OID":52007},{"OID":52008},{"OID":52009},{"OID":52010},{"OID":56812001},{"OID":126201001},{"OID":126201002},{"OID":126201003},{"OID":128370501},{"OID":128370502},{"OID":128370503},{"OID":128370504},{"OID":128370505},{"OID":128370506},{"OID":128370507},{"OID":128370508},{"OID":128370509},{"OID":128370510},{"OID":128370511},{"OID":128370512},{"OID":129266501},{"OID":129266502},{"OID":129266503},{"OID":129266504},{"OID":129266505},{"OID":129266506},{"OID":129266507},{"OID":129266508},{"OID":129266509},{"OID":129266510},{"OID":129266511},{"OID":129266512},{"OID":129266513},{"OID":129266514},{"OID":129266515},{"OID":129266516},{"OID":129266517},{"OID":129266518},{"OID":129266519}]

// module.exports = 
function run(input) {
  let result = [];
  let limit = input.limit;
  let idsList = input.data.map((k) => k[input.id]);

  function splitIntoBatches(arr, batchSize) {
    const batches = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
  }

  const resultBatches = splitIntoBatches(idsList, limit);
  //let query = resultBatches.map((result) => `(${result.join(',')})`).join(` ${input.qop} ${input.qid} ${input.op} `);
  let query = resultBatches
  .map(result => `(${result.filter(value => value !== null && value !== undefined && value !== '').join(',')})`)
  .join(` ${input.qop} ${input.qid} ${input.op} `);

// console.log(query);


  return ` ${input.qid} ${input.op} ${query}`;
};

let input1 = {"limit":"5","data":[{"OID":44503},{"OID":44510},{"OID":44512},{"OID":undefined},{"OID":44527},{"OID":44530},{"OID":44508},{"OID":44519},{"OID":44524},{"OID":44534},{"OID":44501},{"OID":44504},{"OID":44513},{"OID":44514},{"OID":44523},{"OID":44502},{"OID":44518},{"OID":44532},{"OID":44535},{"OID":44507},{"OID":44509},{"OID":44511},{"OID":44516},{"OID":44528},{"OID":44537},{"OID":44517},{"OID":44520},{"OID":44525},{"OID":44526},{"OID":44533},{"OID":44536},{"OID":126192002},{"OID":44505},{"OID":44515},{"OID":44529},{"OID":16136001},{"OID":113862501},{"OID":44522}],"id":"OID","qid":"ADMIN.sshusers.PARTYOID","op":"IN","qop":"OR"}
// console.log(run(input))  

let k = 1;
console.log(k != null)

function run1(input) {
  let result = [];
  let limit = input.limit;
  let idsList = input.data.map((k) => k[input.id]);
  idsList.push('')
  console.log(idsList)
  function splitIntoBatches(arr, batchSize) {
    const batches = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
  }
  let filteredIdsList = idsList.filter(value=> !!value);
  console.log(filteredIdsList)
  if(filteredIdsList.length){
  const resultBatches = splitIntoBatches(filteredIdsList, limit);
  let query = resultBatches.map((result) => `(${result.join(',')})`).join(` ${input.qop} ${input.qid} ${input.op} `);
  // let query = resultBatches
  // .map(result => `(${result.filter(value => value !== null && value !== undefined && value !== '').join(',')})`)
  // .join(` ${input.qop} ${input.qid} ${input.op} `);
  return ` ${input.qid} ${input.op} ${query}`;
  }
  else 
  {
  return ` ${input.qid} IS NOT NULL`;
  }
}

let input =  {
  "query": "  SELECT DISTINCT ADMIN.sshusers.PartyOID\n  FROM ADMIN.sshusers\n  LEFT JOIN ADMIN.messages ON ADMIN.sshusers.PartyOID IN (ADMIN.messages.SenderPartyID, ADMIN.messages.ReceiverPartyOID) \n    AND ADMIN.messages.currentstatetype = 'Delivered' AND ADMIN.messages.deliveredtime > 1490350302324 \n  JOIN ADMIN.usernamepasswordcredentials ON ADMIN.usernamepasswordcredentials.OID = ADMIN.sshusers.UsernamePasswordCredentialsOID\n  WHERE ADMIN.usernamepasswordcredentials.CreationTimestamp > 1490350302324",
  "limit": 2,
  "id": "PARTYOID",
  "qid": "ADMIN.parties.OID",
  "op": "NOT IN",
  "qop": "AND",
  "data":[{"PARTYOID":44503},{"PARTYOID":130124501},{"PARTYOID":130124504},{"PARTYOID":44501},{"PARTYOID":44513},{"PARTYOID":126192001},{"PARTYOID":130124506},{"PARTYOID":44502},{"PARTYOID":44521},{"PARTYOID":44532},{"PARTYOID":128365002},{"PARTYOID":130124503},{"PARTYOID":44528},{"PARTYOID":null},{"PARTYOID":44506},{"PARTYOID":128365001},{"PARTYOID":130124505},{"PARTYOID":44520},{"PARTYOID":128365003},{"PARTYOID":130124502}]
}
console.log(run1(input))