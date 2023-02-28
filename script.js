window.onload = function () {
  // Set the dimensions of the canvas / graph
  let margin = { top: 20, right: 20, bottom: 50, left: 70 },
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
    console.log(data);

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
    svg
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
    let X_SCALE_2 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => parseInt(d.Sepal_Width) + 1)])
      .range([0, width]);

    let Y_SCALE_2 = d3
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
    svg2
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

    // Define a function to get the count of each species
    const count_by_species = Array.from(
      d3.group(data, (d) => d.Species),
      ([key, values]) => ({ Species: key, count: values.length })
    );

    // Define a scale for the x axis of the bar chart
    let X_SCALE_3 = d3
      .scaleBand()
      .domain(
        count_by_species.map(function (d) {
          return d.key;
        })
      )
      .range([0, width])
      .padding(0.2);

    // Define a scale for the y axis of the bar chart
    let Y_SCALE_3 = d3.scaleLinear()
  .domain([0, d3.max(count_by_species, function(d) { return d.count; })])
  .range([height, 0]);

    // Add x axis to the bar chart
    svg3
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(X_SCALE_3));

    // Add y axis to the bar chart
    svg3.append("g").call(d3.axisLeft(Y_SCALE_3));

    // Add bars to the bar chart
    svg3.selectAll("rect")
    .data(count_by_species)
    .enter()
    .append("rect")
    .attr("x", function(d) { return X_SCALE_3(d.Species); })
    .attr("y", function(d) { return Y_SCALE_3(d.count); })
    .attr("width", X_SCALE_3.bandwidth())
    .attr("height", function(d) { return height - Y_SCALE_3(d.count); })
    .style("fill", function(d) { return color(d.Species); });
  });
};
