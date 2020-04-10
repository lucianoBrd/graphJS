/**
 * Initialize the page
 */
function init() {
    
    var button = document.getElementById("sort");

    /* Create listeners */
    document.addEventListener('json-loaded', createGraph);

    button.addEventListener("click", function () {
        sort = !sort;
        /* Remove the svg */
        var container = document.getElementById("container");
        var svg = document.getElementById("svg");

        container.removeChild(svg);

        /* Recreate the svg with the new sort */
        loadDataJSON("./assets/data/data.json");
    });

    /* Get the data JSON and create graph */
    loadDataJSON("./assets/data/data.json");
}

window.onload = init;
