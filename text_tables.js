(function(win){

    var TextTables = win.TextTables || {};
    var MIN_WIDTH = 3;
    var HTML_TEMPLATE = fn2Str(function(){/*
        <div id="{id}_headers_wrapper" style="{headers_wrapper_style}">
            <textarea id="{id}_headers" style="{headers_style}" {headers_attribs}>{headers_text}</textarea>
        </div>
        <div id="{id}_row_numbers_wrapper" style="{row_numbers_wrapper_style}">
            <textarea id="{id}_row_numbers" style="{row_numbers_style}" {row_numbers_attribs}>{row_numbers_text}</textarea>
        </div>
        <div id="{id}_data_rows_wrapper" style="{data_rows_wrapper_style}">
            <textarea id="{id}_data_rows" style="{data_rows_style}" {data_rows_attribs}>{data_rows_text}</textarea>
        </div>
    */});

    var tableProperties = {

        "headers_wrapper_style" : {
            "position": "absolute",
            "display" : "inline-block",
            "top" : "-16px",
            "left" : "80px",
            "right" : "0px",
            "height": "92px",
            "box-sizing" : "border-box",
            "margin" : "0",
            "padding" : "0",
            "font-size" : "0px",
            "border": "1px solid rgb(64,64,64)",
            "border-right": "1px solid rgb(240,240,240)"
        },
        "headers_style" : { 
            "position": "absolute",
            "display" : "inline-block",
            "top" : "0px",
            "left" : "0px",
            "width" : "100%",
            "height" : "100%",
            "border" : "none",
            "background" : "rgb(240,240,240)",
            "color" : "rgb(16,16,16)",
            "font-size" : "13px",
            "font-family": "monospace",
            "box-sizing":"border-box",
            "overflow":"scroll",
            "line-height": "13px",
            "box-sizing": "border-box",
            "padding": "0px",
            "margin": "0px",
            "outline-color" : "transparent"
        },
        "headers_attribs": {
            "wrap" : "off",
            "autocomplete" :"off",
            "autocorrect": "off",
            "autocapitalize":"off",
            "spellcheck":"false",
            "readonly": "readonly"
        },

        "row_numbers_wrapper_style" : {
            "position": "absolute",
            "display" : "inline-block",
            "top" : "32px",
            "left" : "0px",
            "width" : "80px",
            "bottom": "0px",
            "border" : "none",
            "border-right": "1px solid rgb(240,240,240)",
            "border-top" : "1px solid rgb(64,64,64)",
            "box-sizing" : "border-box",
            "margin" : "0",
            "padding" : "0",
            "font-size" : "0px"
        },
        "row_numbers_style" : {
            "position": "absolute",
            "display" : "inline-block",
            "top" : "0px",
            "left" : "0px",
            "width" : "100%",
            "height" : "100%",
            "background" : "rgb(240,240,240)",
            "color" : "rgb(16,16,16)",
            "font-size" : "13px",
            "font-family": "monospace",
            "overflow-x" : "scroll",
            "overflow-y" : "hidden",
            "text-align": "right",
            "box-sizing":"border-box",
            "line-height": "13px",
            "box-sizing": "border-box",
            "padding": "0px",
            "margin": "0px",
            "resize": "none",
            "outline-color" : "transparent",
            "border" : "none"
        },
        "row_numbers_attribs" : {
            "wrap" : "off",
            "autocomplete" :"off",
            "autocorrect": "off",
            "autocapitalize":"off",
            "spellcheck":"false",
            "readonly": "readonly"
        },

        "data_rows_wrapper_style" : {
            "position": "absolute",
            "display" : "inline-block",
            "top" : "32px",
            "left" : "80px",
            "right": "0px",
            "bottom": "0px",
            "border" : "1px solid rgb(255,255,255)",
            "border-top": "1px solid rgb(64,64,64)",
            "border-left": "1px solid rgb(64,64,64)",
            "box-sizing" : "border-box",
            "margin" : "0",
            "padding" : "0",
            "font-size" : "0px"
        },
        "data_rows_style" : {
            "position": "absolute",
            "display" : "inline-block",
            "top" : "0px",
            "left" : "0px",
            "width" : "100%",
            "height" : "100%",
            "overflow" : "scroll",
            "text-align" : "right",
            "border": "none",
            "background" : "rgb(255,255,255)",
            "color" : "rgb(16,16,16)",
            "font-size" : "13px",
            "font-family": "monospace",
            "resize" : "none",
            "box-sizing":"border-box",
            "line-height": "13px",
            "padding": "0px",
            "margin": "0px",
            "outline-color" : "transparent"
            
        },
        "data_rows_attribs" : { 
            "wrap" : "off",
            "onscroll" : "TextTables.handleScroll(event)",
            "autocomplete" :"off",
            "autocorrect": "off",
            "autocapitalize":"off",
            "spellcheck":"false",
            "readonly": "readonly"
        }
        
    };

    function jsObjectToCssText(obj) {
        var cssText = "";
        var value = "";
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                cssText += name + ":" + obj[name] + "; ";
            }
        }
        return cssText.trim();
    }

    function jsObjectToAttribs(obj) {
        var attribs = "";
        var value = "";
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                attribs += name + "=\"" + obj[name] + "\" ";
            }
        }
        return attribs;
    }

    function templateFill(template,valuesObj) {
        var regExp;
        for(var name in valuesObj) {
            if (valuesObj.hasOwnProperty(name)) {
                regExp = new RegExp("\\{" + name + "\\}","g");
                template = template.replace(regExp,valuesObj[name]);
            }
        }
        return template;
    }

    function fn2Str(fn) {
        var s = String(fn);
        return s.substring(s.indexOf("/*")+2,s.lastIndexOf("*/"));
    }

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
                "width" : headerName.length > MIN_WIDTH ? (headerName.length +1 ): MIN_WIDTH 
            });
        }
        tableObject.data = csvData;
        return tableObject;
    }

    function convertToFlatText(csvText) {
        var table = convertToCsvTable(csvText);
        var data = table.data;
        var headers = table.headers;
        var row;
        var cellValue;
        var dataText = "";
        var rowNums = "1 \n";
        var emptyHeaderText = "";
        var headerText = "";

        for (var h = 0; h < headers.length; h += 1) {
            emptyHeaderText += padLeft("",headers[h].width) + "|";
            headerText += padLeft(headers[h].name,headers[h].width) + "|";
        }

        for (var r = 1; r < data.length; r += 1) {
            rowNums += (r+1) + " \n";
            row = data[r];
            for (var c = 0; c < row.length; c += 1) {
                cellValue = row[c];
                dataText += padLeft(cellValue,headers[c].width) + "|";
            }
            dataText += "\n";
        }
        return {
            "headersText" : emptyHeaderText + "\n" + emptyHeaderText + "\n" + headerText + "\n" + emptyHeaderText,
            "rowNumbersText" : rowNums,
            "dataRowsText" : dataText
        };
    }

    TextTables.loadTable = function TextTables_loadTable( elemId, csvText ) {
        
        var tableInfo = convertToFlatText(csvText);

        var objectFill = {
            "id" : elemId,
            "headers_text" : tableInfo.headersText,
            "row_numbers_text": tableInfo.rowNumbersText,
            "data_rows_text" : tableInfo.dataRowsText,
            "headers_wrapper_style" : jsObjectToCssText(tableProperties.headers_wrapper_style),
            "headers_style" : jsObjectToCssText(tableProperties.headers_style),
            "headers_attribs": jsObjectToAttribs(tableProperties.headers_attribs),
            "row_numbers_wrapper_style" : jsObjectToCssText(tableProperties.row_numbers_wrapper_style),
            "row_numbers_style" : jsObjectToCssText(tableProperties.row_numbers_style),
            "row_numbers_attribs": jsObjectToAttribs(tableProperties.row_numbers_attribs),
            "data_rows_wrapper_style":jsObjectToCssText(tableProperties.data_rows_wrapper_style),
            "data_rows_style":jsObjectToCssText(tableProperties.data_rows_style),
            "data_rows_attribs": jsObjectToAttribs(tableProperties.data_rows_attribs)
        };

        document.getElementById(elemId).innerHTML = templateFill(HTML_TEMPLATE,objectFill);
        document.getElementById(elemId).style.overflow = "hidden";
        document.getElementById(elemId).style.background = "rgb(240,240,240)";
        document.getElementById(elemId).style.border = "1px solid rgb(64,64,64)";
    };

    TextTables.handleScroll = function TextTables_handleScroll(ev) {
        var e = ev || window.event;
        var el = e.target || e.srcElement;
        var id = el.id;
        var rootName = id.substring(0,id.indexOf("_"));

        var rowNumsEl = document.getElementById(rootName + "_row_numbers");
        var headersEl = document.getElementById(rootName + "_headers");

        rowNumsEl.scrollTop = el.scrollTop;
        headersEl.scrollLeft = el.scrollLeft;
    };

    win.TextTables = TextTables;

}(window));
