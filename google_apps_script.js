function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    // Format the current date and time using the spreadsheet's timezone
    var timezone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    var formattedDate = Utilities.formatDate(new Date(), timezone, "M/d/yyyy H:mm:ss");
    
    // Append the student data as a new row
    sheet.appendRow([
      data.name,
      data.regNo,
      data.sem1,
      data.sem2,
      data.sem3,
      data.sem4,
      data.sem5,
      data.sem6,
      data.cgpa,
      formattedDate // Appends the localized date and time in the 10th column (Column J)
    ]);
    
    /* 
    // Automatically sort the sheet from Row 2 to Last Row
    // Column 9 is the CGPA column, sorted descending (highest score at top)
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    if (lastRow > 2) {
      var range = sheet.getRange(2, 1, lastRow - 1, lastColumn);
      range.sort({column: 9, ascending: false});
    }
    */
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Run this function ONCE in the Apps Script editor to sort all existing rows immediately!
function sortExistingData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  if (lastRow > 2) {
    var range = sheet.getRange(2, 1, lastRow - 1, lastColumn);
    range.sort({column: 9, ascending: false}); // Sorts by CGPA (Column 9) in descending order
    Logger.log("Existing data sorted successfully!");
  } else {
    Logger.log("Not enough rows to sort.");
  }
}
