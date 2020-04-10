sort = false;

function createGraph() {
    var xMin = 90,
        xMax = 705,
        xGap = xMax - xMin,
        yMin = 370,
        yMax = 5,
        yGap = yMax - yMin;

    /* Create SVG */
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "graph");
    svg.setAttribute("id", "svg");
    svg.setAttribute("version", 1.2);

    /* GridX */
    var gridX = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gridX.setAttribute("id", "xGrid");
    gridX.setAttribute("class", "grid x-grid");
    /* Line */
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", xMin);
    line.setAttribute("x2", xMin);
    line.setAttribute("y1", yMax);
    line.setAttribute("y2", yMin);
    gridX.appendChild(line);

    /* GridY */
    var gridY = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gridY.setAttribute("id", "YGrid");
    gridY.setAttribute("class", "grid y-grid");
    /* Line */
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", xMin);
    line.setAttribute("x2", xMax);
    line.setAttribute("y1", yMin);
    line.setAttribute("y2", yMin);
    gridY.appendChild(line);

    /* xLabel */
    var xLabel = document.createElementNS("http://www.w3.org/2000/svg", "g");
    xLabel.setAttribute("class", "labels x-labels");
    /* Text */
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", xMin + 310);
    text.setAttribute("y", yMin + 70);
    text.setAttribute("class", "label-title");
    /* Texte */
    var t = document.createTextNode("Année");
    text.appendChild(t);
    xLabel.appendChild(text);

    /* yLabel */
    var yLabel = document.createElementNS("http://www.w3.org/2000/svg", "g");
    yLabel.setAttribute("class", "labels y-labels");
    /* Text */
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", xMin - 10);
    text.setAttribute("y", yMin - 170);
    text.setAttribute("class", "label-title");
    /* Texte */
    var t = document.createTextNode("Population");
    text.appendChild(t);
    yLabel.appendChild(text);

    /* Polyline */
    var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#3f72af");
    polyline.setAttribute("stroke-width", 2);

    /* DataSet */
    var dataSet = document.createElementNS("http://www.w3.org/2000/svg", "g");
    dataSet.setAttribute("class", "data");
    dataSet.setAttribute("data-setname", "Point démographiques");

    /* Add elements to SVG */
    svg.appendChild(dataSet);
    svg.appendChild(polyline);
    svg.appendChild(yLabel);
    svg.appendChild(xLabel);
    svg.appendChild(gridY);
    svg.appendChild(gridX);

    /* Get the data JSON */
    fetch('./data.json').then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw ("Error " + response.status);
        }
    }).then(function (data) {
        var length = data.length;

        /* Sort data by population */
        data.sort(function (a, b) {
            return a.population - b.population;
        });
        var populationMin = parseInt(data[0].population);
        var populationGap = parseInt(data[length - 1].population - populationMin);

        /* Add ordinate texts */
        var ordPos = [373, 248, 131, 15];
        for (let i = 0; i < 4; i++) {
            var date = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var text = document.createTextNode(
                populationMin + Math.round(((ordPos[i] - yMin) / yGap * populationGap))
            );
            date.appendChild(text);

            date.setAttribute("x", xMin - 35);
            date.setAttribute("y", ordPos[i]);

            xLabel.appendChild(date);
        }

        /* Sort data by date */
        data.sort(function (a, b) {
            if(!sort){
                return a.year - b.year;
            } else {
                return b.year - a.year;
            }
            
        });
        var dateMin = parseInt(data[0].year);
        var dateGap = parseInt(data[length - 1].year - dateMin);

        /* Add absciss texts */
        var absPos = [100, 246, 392, 538, 684];
        for (let i = 0; i < 5; i++) {
            var date = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var text = document.createTextNode(
                dateMin + Math.round(((absPos[i] - xMin) / xGap * dateGap))
            );
            date.appendChild(text);

            date.setAttribute("x", absPos[i]);
            date.setAttribute("y", yMin + 30);

            xLabel.appendChild(date);
        }


        /* For each data add to the graph */
        var points = "";        
        data.forEach(point => {
            var x = xMin + ((point.year - dateMin) / dateGap * xGap);
            var y = yMin + ((point.population - populationMin) / populationGap * yGap);
            points += x + "," + y + " ";

            /* Circle */
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", 4);
            circle.setAttribute("data-value", point.population);
            circle.setAttribute("data-date", point.year);
            dataSet.appendChild(circle);

            /* Text */
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x + 10);
            text.setAttribute("y", !sort ? y + 10 : y - 10);
            text.setAttribute("class", "label-data");
            text.setAttribute("visibility", "hidden");
            /* Texte */
            var t = document.createTextNode(point.population + "," + point.year);
            text.appendChild(t);
            dataSet.appendChild(text);

            /* Add event */
            circle.addEventListener("mouseover", function(){
                this.classList.add("data-hover");
                this.setAttribute("r", 7);
                text.setAttribute("visibility", "visible");
            });
            circle.addEventListener("mouseout", function(){
                this.classList.remove("data-hover");
                this.setAttribute("r", 4);
                text.setAttribute("visibility", "hidden");
            });

        });

        polyline.setAttribute("points", points);

        var container = document.getElementById("container");
        container.appendChild(svg);

    });

}

function init() {
    createGraph();
    var button = document.getElementById("sort");

    button.addEventListener("click", function(){
        sort = !sort;
        /* Remove the svg */
        var container = document.getElementById("container");
        var svg = document.getElementById("svg");
        container.removeChild(svg);

        /* Recreate the svg with the new sort */
        createGraph();
    });
}

window.onload = init;
