function (input) {
  try {
      let currentDestination = JSON.parse(localStorage.getItem('currentDestination'));
      let states = ["RECEIVING", "POST_PROC/ARCHIVED", "RECEIVED", "SENDING", "SENT", "POST_PROC", "AVAILABLE", "TO_EXECUTE", "SUBMITTED"];
      if (currentDestination && currentDestination.details) {
          input.pageData.currentDestination = currentDestination.details;
      } else {
          throw new Error("Current destination details are missing");
      }
      $(document).ready(() => {
          let overAll = document.getElementById(`overallStatus`);
          if (input.pageData.currentDestination.status === "Successful") {
              overAll.classList.add("font-color-green");
          } else {
              overAll.classList.add("font-color-red");
          }
          input.pageData?.destinations?.forEach((destination, index) => {
              let statusElement = document.getElementById(`status-${index}`);
              let messageElement = document.getElementById(`message-${index}`);
              if (statusElement) {
                  if (states.includes(destination.Status)) {
                      statusElement.classList.add("font-color-green");
                      messageElement.classList.add("font-color-green");                  
                  } else {
                      statusElement.classList.add("font-color-red");
                      messageElement.classList.add("font-color-red");                  
                  }
              } else {
                  console.log(`Status element not found for destination index: ${index}`);
              }
              const [datePart, timePart] = destination['DateTime'].split(' ');
              const [month, day, year] = datePart.split('-');
              const [hours, minutes, seconds] = timePart.split(':');
              const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
              console.log('date', date);
              destination['DateTime'] = date.getTime();
              destination.showSuccess = states.includes(destination.Status);
          destination.showFail = !destination.showSuccess;
          });
      });
      console.log(input.pageData);
      return true;
  } catch (error) {
      console.log("Error", error);
      return false;
  }
}