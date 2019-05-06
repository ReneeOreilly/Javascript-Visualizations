function buildMetadata(sample) {
  
  var MetaData = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(MetaData).then(function(sample) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metapanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metapanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var row = metapanel.append("p");
      row.text(`${key}: ${value}`);
   })
   })
  };


function buildCharts(sample) {
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
   var chartdata = `/samples/${sample}`;
   d3.json(chartdata).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data

    var bubble = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
      }
    };

    var response = [bubble];
    var layout = {
      xaxis: {title: "OTU_IDs"}
    };
    Plotly.newPlot("bubble", response, layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each)
    d3.json(chartdata).then(function(data){
      var values = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);

      var pie_chart = [{
        values: values,
        lables: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot('pie', pie_chart);
    });
  });
};
function init() {
  // Grab a reference to the dropdown select element
  
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
