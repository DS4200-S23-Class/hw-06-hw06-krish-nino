window.onload = function () {
  // Set the dimensions of the canvas / graph
  let margin = { top: 20, right: 50, bottom: 50, left: 20 },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the svg object to the div with id "scatterplot"
  let svg = d3
    .select("#scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let svg2 = d3
    .select("#scatterplot2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let svg3 = d3
    .select("#barchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Read the data from the CSV file
  d3.csv("data/iris.csv").then((data) => {
    // Define scales for x and y axes
    let X_SCALE_1 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => parseInt(d.Sepal_Length) + 1)])
      .range([0, width]);

    let Y_SCALE_1 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => parseInt(d.Petal_Length) + 1)])
      .range([height, 0]);

    // Define color scale for species
    let color = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    // Add x axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(X_SCALE_1));

    // Add y axis
    svg.append("g").call(d3.axisLeft(Y_SCALE_1));

    // Add dots to the scatterplot
   let graph1 =  svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return X_SCALE_1(d.Sepal_Length);
      })
      .attr("cy", function (d) {
        return Y_SCALE_1(d.Petal_Length);
      })
      .attr("r", 5)
      .style("fill", function (d) {
        return color(d.Species);
      })
      .style("opacity", 0.5);

    // Define scales for x and y axes
    const X_SCALE_2 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => parseInt(d.Sepal_Width) + 1)])
      .range([0, width]);

    const Y_SCALE_2 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => parseInt(d.Petal_Width) + 1)])
      .range([height, 0]);

    // Add x axis
    svg2
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(X_SCALE_2));

    // Add y axis
    svg2.append("g").call(d3.axisLeft(Y_SCALE_2));

    // Add dots to the scatterplot
    let graph2 = svg2
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return X_SCALE_2(d.Sepal_Width);
      })
      .attr("cy", function (d) {
        return Y_SCALE_2(d.Petal_Width);
      })
      .attr("r", 5)
      .style("fill", function (d) {
        return color(d.Species);
      })
      .style("opacity", 0.5);

    let brush = d3
      .brush()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("start brush", updateChart);

    svg2.call(brush);

    // Function that is triggered when brushing is performed
    function updateChart(event) {
      extent = event.selection;
      graph1.classed("selected", function (d) {
        return isBrushed(
          extent,
          X_SCALE_2(d.Sepal_Width),
          Y_SCALE_2(d.Petal_Width)
        );
      });
      graph2.classed("selected", function (d) {
        return isBrushed(
          extent,
          X_SCALE_2(d.Sepal_Width),
          Y_SCALE_2(d.Petal_Width)
        );
      });
      bar_graph.classed("bar_selected", function (d) {
        return isBrushed(
          extent,
          X_SCALE_2(d.Sepal_Width),
          Y_SCALE_2(d.Petal_Width)
        );
      });
    }

    // A function that returns true if a dot is in the brush selection, and false otherwise
    function isBrushed(brush_coords, cx, cy) {
        let x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    // scaling x function for bar graph
    const X_SCALE3 = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.Species;
        })
      )
      .range([0, width])
      .padding(0.2);

    // scaling y function for bar graph
    const Y_SCALE3 = d3.scaleLinear().domain([0, 50]).range([height, 0]);

    const data2 = [
      { Species: "setosa", Amount: 50 },
      { Species: "versicolor", Amount: 50 },
      { Species: "virginica", Amount: 50 },
    ];

    // add bars
    let bar_graph = svg3
      .append("g")
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => {
        return X_SCALE3(d.Species) + margin.left;
      })
      .attr("y", function(d) { 
        return Y_SCALE3(50) + margin.top; })

      .attr("width", X_SCALE3.bandwidth())
      .attr("height", (d) => {
        return height - Y_SCALE3(50);
      })
      .attr("class", (d) => {
        return d.Species + " bar";
      })
      .attr("fill", (d) => { return color(d.Species); })

      svg3.selectAll("g").style("opacity", 0.5)

    // Add an X axis to the vis
    svg3
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (height + margin.top) + ")"
      )
      .call(d3.axisBottom(X_SCALE3).ticks(10))

    // Add a Y axis to the vis
    svg3
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(d3.axisLeft(Y_SCALE3).ticks(10))
  });
};
