/**
 * Load the data JSON
 * Create event in case of success
 * @param {*} data_file 
 */
function loadDataJSON(data_file) {
    var http_request = new XMLHttpRequest();

    data = null;
    try {
        /* Opera 8.0+, Firefox, Chrome, Safari */
        http_request = new XMLHttpRequest();
    } catch (e) {
        /* Internet Explorer Browsers */
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");

        } catch (e) {

            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                /* Something went wrong */
                alert("Une erreur est survenue");
            }
        }
    }

    http_request.onreadystatechange = function () {

        if (http_request.readyState == 4) {
            /* Javascript function JSON.parse to parse JSON data */
            data = JSON.parse(http_request.responseText);

            /* Create event */
            var event = createNewEvent('json-loaded');
            document.dispatchEvent(event);

        }
    }

    http_request.open("GET", data_file, true);
    http_request.send();
}

/**
 * Create an event and check if navigator
 * support default methods
 * @param {*} eventName 
 * @returns event
 */
function createNewEvent(eventName) {
    var event;
    if (typeof (Event) === 'function') {
        event = new Event(eventName);
    } else {
        event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
    }
    return event;
}