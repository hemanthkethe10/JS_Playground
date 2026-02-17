
function run(input) {
  input.pageData.postRouteSettings = input.pageData.postRouteSettings || {};
  input.pageData.postRouteSettings.onSuccessPostRoutingSettings =
    input.pageForm.updateRoute[input.index].postRouteSettings.onSuccessPostRoutingSettings;
  input.pageData.moved =
    input.pageData.postRouteSettings.onSuccessPostRoutingSettings === "moved";
  return input;
}

function run1(input) {
  input.pageData.postRouteSettings = input.pageData.postRouteSettings || {};
  input.pageData.postRouteSettings.onFailurePostRoutingSettings =
    input.pageForm.updateRoute[input.index].postRouteSettings.onFailurePostRoutingSettings;
  input.pageData.move =
    input.pageData.postRouteSettings.onFailurePostRoutingSettings === "move";
  return true;
}