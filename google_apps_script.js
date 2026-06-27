function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
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
      data.percentage
    ]);
    
    // Automatically sort the sheet from Row 2 to Last Row
    // Column 9 is the CGPA column, sorted descending (highest score at top)
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    if (lastRow > 2) {
      var range = sheet.getRange(2, 1, lastRow - 1, lastColumn);
      range.sort({column: 9, ascending: false});
    }
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
