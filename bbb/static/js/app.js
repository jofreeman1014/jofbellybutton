function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {

    // console.log(response);

    var data = response;
    var metadata = d3.select("#sample-metadata");
    metadata.html("");
    metadata.append("div").html(`Age: ${response.AGE}`);
    metadata.append("div").html(`BBTYPE: ${response.BBTYPE}`);
    metadata.append("div").html(`Ethnicity: ${response.ETHNICITY}`);
    metadata.append("div").html(`Gender: ${response.GENDER}`);
    metadata.append("div").html(`Location: ${response.LOCATION}`);
    metadata.append("div").html(`WFREQ: ${response.WFREQ}`);
    metadata.append("div").html(`Sample #: ${response.sample}`);
    buildGauge(response.WFREQ);

  });    
};



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // console.log(sample);
  var url2 = `/samples/${sample}`;

  d3.json(url2).then(function(response) {
    // PIE PLOT
    var pieData = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      type: "pie",
      hovertext: response.otu_labels.slice(0,10)
    }];
    var pieLayout = {title: "Top 10 Sample %'s"};

    Plotly.newPlot("pie", pieData, pieLayout);

    // BUBBLE PLOT
    var bubData = [{
      x: response.otu_ids.slice(0,10),
      y: response.sample_values.slice(0,10),
      marker: {
        size:response.sample_values.slice(0,10),
        color: response.otu_ids.slice(0,10)
      },
      type: "scatter",
      mode: "markers",
      hovertext: response.otu_labels.slice(0,10)
    }];
    var bubLayout = [{
      xaxis: {title: "OTU ID"}
    }];
    Plotly.newPlot("bubble", bubData, bubLayout);
  });
}

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
