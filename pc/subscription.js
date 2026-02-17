//On success
//On Failure
//Client Download On succes
//Client Download On failure



module.exports = (input) => {
  const successAction = input.successAction || {};

  if (successAction.onSuccessMove) {
    return "moved";
  } else if (successAction.action) {
    return "action";
  } else if (successAction.onDelete) {
    return "onDelete";
  }

  return null;
};


module.exports = (input) => {
  const failureAction = input.failureAction || {};
  if (failureAction. onFailureMove) {
    return "move";
  } else if (failureAction. onAction) {
    return "onAction";
  } else if (failureAction. noDelete) {
    return "noDelete";
  }

  return null;
};


module.exports = (input) => {
  const postClientSuccessActions = input.postClientSuccessActions || {};

  if (postClientSuccessActions.routes) {
    return "routes";
  } else if (postClientSuccessActions.noAction) {
    return "noAction";
  } else if (postClientSuccessActions.deleted) {
    return "deleted";
  }
};

module.exports = (input) => {
  const postClientFailureActions = input.postClientFailureActions || {};

  if (postClientFailureActions.onRoute) {
    return "onRoute";
  } else if (postClientFailureActions.noaction) {
    return "noaction";
  } else if (postClientFailureActions.delete) {
    return "delete";
  }

  return null;
};

module.exports = (input) => {
//On success
//On Failure
//Client Download On succes
//Client Download On failure
//   const successAction = input.successAction || {};
//   const failureAction = input.failureAction || {};
//   const postClientSuccessAction = input.postClientSuccessAction || {};
//   const postClientFailureAction = input.postClientFailureAction || {};
  //successAction,failureAction,postClientSuccessAction,postClientFailureAction
  let actionType = input.actionType;
  let payload = input[actionType];
  let transmissionSettings = input.transmissionSettings;
  if (payload.onRoute){
    if (actionType === "postClientSuccessAction"){
    transmissionSettings["postClientDownloadTypeOnSuccessDoAdvancedRouting"] = payload.routes
    }
    else{
    transmissionSettings["postClientDownloadTypeOnFailDoAdvancedRouting"] = payload.routes
    }
  }
    //deleted is for Post Routing Actions
  if(payload.deleted){  
    transmissionSettings["postClientDownloadActionType"] = payload.deleted;
  }
  //delete is for Post Client Actions
  if (payload.delete){
     transmissionSettings["postClientDownloadTypeOnPermfailDoDelete"] = payload.delete === 'DELETE';
  }
  if(payload.onDelete){
    transmissionSettings["ppaOnSuccessInDoDelete"] = payload.onDelete
  }
  if(payload.onSuccessMove){
    transmissionSettings["ppaOnSuccessInDoMove"]=payload.onSuccessMove
  }
  if(payload.onFailureMove){
    transmissionSettings["ppaOnFailInDoMove"]=payload.onFailureMove
  }
  if(payload.noDelete){
    transmissionSettings["ppaOnFailInDoDelete"]=payload.noDelete
  }

  if(payload.action){
    //No need to add variable
  }
  if(payload.onAction){
    //No need to add variable
  }
  return transmissionSettings;
}





