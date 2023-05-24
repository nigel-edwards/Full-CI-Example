function getData(url, callBackFunc) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callBackFunc(JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function getTableHeaders(obj) {
    var tableHeaders = [];

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`)
    });

    return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, previous) {
    if (next && previous) {
        return `<button onclick="writeToDocument('${previous}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !previous) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`
    } else if (!next && previous) {
        return `<button onclick="writeToDocument('${previous}')">Previous</button>`;
    }
}

function writeToDocument(url) {
    var el = document.getElementById("data");
    el.innerHTML = "";

    getData(url, function(data) {
        var tableRows = [];
        var pagination;
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous);
        }
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]);

        data.forEach(function(item) {
            var dataRow = [];

            Object.keys(item).forEach(function(key) {
                var rowData = item[key].toString();
                var truncData = rowData.substring(0, 15);
                dataRow.push(`<td>${truncData}</td>`);
            });
            tableRows.push(`<tr> ${dataRow} </tr>`)
        });

        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`;
    });
}
