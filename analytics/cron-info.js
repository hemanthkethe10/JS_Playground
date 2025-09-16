function run(input) {
    console.log("121212",input)
    input.pageData.offset = 25;
    input.pageData.searchStr = "";
    input.pageData.showSchedule = false
    input.pageData.showEmail = false
    input.pageData.showReport = false 
    input.pageData.editReport = false
    input.pageData.showGenerate = false
    
    let data = input?.pageData?.data ?? []
     let showResults = true
    if(input.pageData?.data == 0){
    showResults = false
    }
    input.pageData.showResults = showResults  
    console.log("after adding data",input)
    data.forEach(item => {
      item.isEditable = item?.source === "reports";
      item.isViewable = item?.source === "files";
      item.isNotDeletable = item?.owner === "OOTB";
        let timestamp = item?.lastRun ?? ""
      let date = new Date(parseInt(timestamp));
    
      // Options for formatting the date and time, using the browser's time zone
      let options = {
        year: 'numeric', 
        month: 'short', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Automatically detecting the time zone
      };
    
      // Format the date and time using the browser's time zone
      let formattedDate = ""
    if(timestamp != ""){
      formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    }
    
       item.formattedDate = formattedDate
    });
    input.pageData.data = data
    
    input.pageProps.duration = [
      {
        "label": "Today So Far",
        "value": "Today So Far"
      },
      {
        "label": "Yesterday",
        "value": "Yesterday"
      },
      {
        "label": "This Week So Far",
        "value": "This Week So Far"
      },
      {
        "label": "Last Week",
        "value": "Last Week"
      },
      {
        "label": "This Month So Far",
        "value": "This Month So Far"
      },
      {
        "label": "Last Month",
        "value": "Last Month"
      },
      {
        "label": "This Quarter So Far",
        "value": "This Quarter So Far"
      },
      {
        "label": "Last Quarter",
        "value": "Last Quarter"
      },
      {
        "label": "This Year So Far",
        "value": "This Year So Far"
      },
      {
        "label": "Last Year",
        "value": "Last Year"
      }
    ]
    input.pageProps.timeDuration = [
      { label: '12:00 am', value: '12:00 am' },
      { label: '1:00 am', value: '1:00 am' },
      { label: '2:00 am', value: '2:00 am' },
      { label: '3:00 am', value: '3:00 am' },
      { label: '4:00 am', value: '4:00 am' },
      { label: '5:00 am', value: '5:00 am' },
      { label: '6:00 am', value: '6:00 am' },
      { label: '7:00 am', value: '7:00 am' },
      { label: '8:00 am', value: '8:00 am' },
      { label: '9:00 am', value: '9:00 am' },
      { label: '10:00 am', value: '10:00 am' },
      { label: '11:00 am', value: '11:00 am' },
      { label: '12:00 pm', value: '12:00 pm' },
      { label: '1:00 pm', value: '1:00 pm' },
      { label: '2:00 pm', value: '2:00 pm' },
      { label: '3:00 pm', value: '3:00 pm' },
      { label: '4:00 pm', value: '4:00 pm' },
      { label: '5:00 pm', value: '5:00 pm' },
      { label: '6:00 pm', value: '6:00 pm' },
      { label: '7:00 pm', value: '7:00 pm' },
      { label: '8:00 pm', value: '8:00 pm' },
      { label: '9:00 pm', value: '9:00 pm' },
      { label: '10:00 pm', value: '10:00 pm' },
      { label: '11:00 pm', value: '11:00 pm' }
    ]
    
    
    input.pageProps.scheduleDuration = [
      { "label": "Daily", "value": "Daily" },
      { "label": "Weekly", "value": "Weekly" },
      { "label": "Monthly", "value": "Monthly" },
      { "label": "Bi Weekly"}
    ]
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${day}-${month}-${year}`;
    input.pageData.date = dateString
    input.pageProps.weekDays = [
      { "label": "Sunday", "value": "SUN" },
      { "label": "Monday", "value": "MON" },
      { "label": "Tuesday", "value": "TUE" },
      { "label": "Wednesday", "value": "WED" },
      { "label": "Thursday", "value": "THU" },
      { "label": "Friday", "value": "FRI" },
      { "label": "Saturday", "value": "SAT" }
    ]
    
    input.pageProps.monthDays = [
      { "label": "1", "value": "1" },
      { "label": "2", "value": "2" },
      { "label": "3", "value": "3" },
      { "label": "4", "value": "4" },
      { "label": "5", "value": "5" },
      { "label": "6", "value": "6" },
      { "label": "7", "value": "7" },
      { "label": "8", "value": "8" },
      { "label": "9", "value": "9" },
      { "label": "10", "value": "10" },
      { "label": "11", "value": "11" },
      { "label": "12", "value": "12" },
      { "label": "13", "value": "13" },
      { "label": "14", "value": "14" },
      { "label": "15", "value": "15" },
      { "label": "16", "value": "16" },
      { "label": "17", "value": "17" },
      { "label": "18", "value": "18" },
      { "label": "19", "value": "19" },
      { "label": "20", "value": "20" },
      { "label": "21", "value": "21" },
      { "label": "22", "value": "22" },
      { "label": "23", "value": "23" },
      { "label": "24", "value": "24" },
      { "label": "25", "value": "25" },
      { "label": "26", "value": "26" },
      { "label": "27", "value": "27" },
      { "label": "28", "value": "28" }
    ]
    
    }