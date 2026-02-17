module.exports = (input) => {
  try {
    const postRouteSettings = input.postRouteSettings || {};
    const postClientDownload = input.postClientDownload || {};

    return {
      postRouteSettings: {
        onSuccessPostRoutingSettings: {
          moved:postRouteSettings?.onSuccessPostRoutingSettings === "moved" ? true : null,
          onSuccessMove: postRouteSettings?.onSuccessMove || null,
          action: postRouteSettings?.onSuccessPostRoutingSettings === "action" ? true : null,
        onDelete: postRouteSettings?.onSuccessPostRoutingSettings === "onDelete" ? true : null
        },

        onFailurePostRoutingSettings: {
          move: postRouteSettings?.onFailurePostRoutingSettings === "move" ? true : null,
          onAction: postRouteSettings?.onFailurePostRoutingSettings === "onAction" ? true : null,onFailureMove: postRouteSettings?.onFailureMove || null,
          noDelete: postRouteSettings?.onFailurePostRoutingSettings === "noDelete" ? true : null
        }
      },

      postClientDownload: {
        onSuccessPostClientDownload: {
          routes: postClientDownload?.onSuccessPostClientDownload === "routes" ? true : null,
          noAction: postClientDownload?.onSuccessPostClientDownload === "noAction" ? true: null,
          deleted: postClientDownload?.onSuccessPostClientDownload === "deleted" ? "DELETE" : null
        },

        onFailurePostClientDownload: {
          onRoute: postClientDownload?.onFailurePostClientDownload === "onRoute" ? true : null,
          noaction: postClientDownload?.onFailurePostClientDownload === "noaction" ? true : null,
          delete: postClientDownload?.onFailurePostClientDownload === "delete" ? "DELETE": null
        }
      }
    };
  } catch (error) {
    return "Error in postRouteSettings mapping: " + error;
  }
};