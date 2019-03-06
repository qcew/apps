(function(win){

    var TextTables = win.TextTables || {};

    var MIN_WIDTH = 16;

    function padLeft(val,len) {
        if (val.length > len) {
            val = val.substring(0,len-4) + "... ";
        } else {
            while (val.length < len) {
                val = " " + val;
            }
        }
        return val;
    }

    //https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
    function csvParse(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function(m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    }

    function csvTextToArray(csvText) {
        var csvArray = [];        
        var lines = csvText.replace(/\r/g,"").split("\n");
        for (var i = 0; i < lines.length; i += 1) {
            csvArray.push(csvParse(lines[i]));
        }
        return csvArray;
    }

    function convertToCsvTable(csvText) {
        var csvData = csvTextToArray(csvText);
        var headers = csvData[0];
        var headerName = "";
        var tableObject = {
            "headers" : [],
            "count" : csvData.length
        };
    
        for (var i = 0; i < headers.length; i += 1) {
            headerName = headers[i];
            tableObject.headers.push({
                "name" : headerName,
                "width" : headerName.length > MIN_WIDTH ? (headerName.length +2 ): MIN_WIDTH 
            });
        }
        tableObject.data = csvData;
        return tableObject;
    }


    TextTables.setTextarea = function TextTables_setTextArea ( elemId, csvText ) {
        var table = convertToCsvTable(csvText);
        var data = table.data;
        var headers = table.headers;
        var row;
        var cellValue;
        var text = "";
        for (var r = 0; r < data.length; r += 1) {
            row = data[r];
            for (var c = 0; c < row.length; c += 1) {
                cellValue = row[c];
                text += padLeft(cellValue,headers[c].width) + "|";
            }
            text += "\n";
        }
        document.getElementById(elemId).value = text;
    };


    win.TextTables = TextTables;

}(window));
