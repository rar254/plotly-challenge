/* The following is an example on how you might structure your code.
This is not the only way to complete this assignment.
Feel free to disregard and create your own code */

// Define a function that will create metadata for given sample
function buildMetadata(sample) {
    // Read the json data
    d3.json("../../samples.json").then(function(data){
        //SELECT data and test
        var metaData = data.metadata;
        console.log(sample);
        //create a filter to select the desired data(sample)
        var filter = metaData.filter(otu =>otu.id == sample);
        //check the filtered data
        console.log(filter);
        // Parse and filter the data to get the sample's metadata
        var data = filter[0];
        console.log(data);
        var display = d3.select("#sample-metadata")
        //clear and input our new data into our html
        display.html("");
        // Specify the location of the metadata and update it
        //break data into key,value to append
        Object.entries(data).forEach(([key, value])=> {
            console.log(key,value);
            //add our data using h4 anchor tag/text
            display.append("h4").text(`${key}: ${value}`);
        });
    });
};

//Checks to make sure the buildMetadata function works properly
//buildMetadata(940);

// Define a function that will create charts for given sample
function buildCharts(sample) {
    // Read the json data
    d3.json("../../samples.json").then(function(data){
        var bio = data.samples;
        // Parse and filter the data to get the sample's OTU data
        var filter = bio.filter(otu => otu.id == sample);
        console.log(filter)
        var data = filter[0];
        // Pay attention to what data is required for each chart
        var sample_values = data.sample_values;
        var otu_labels = data.otu_labels;
        var otu_ids = data.otu_ids;

        // Create bar chart in correct location
        var bardata = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otu_id => `otu_id${otu_id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: "h"
        }];  
            Plotly.newPlot("bar", bardata);
        
        // Create bubble chart in correct location
        var bubbledata = [{
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            marker: {
              color: otu_ids,
              size: sample_values,
              colorscale: "Earth"
            }
          }];
        var layout = {
            title: "OTU ID",
            showlegend: false,
            height: 600,
            width: 1700
          };
        Plotly.newPlot("bubble", bubbledata, layout);
        
    });
    
};
//buildCharts(940);

// Define function that will run on page load
function init() {
    var selector = d3.select("#selDataset");
    // Read json data
    d3.json("../../samples.json").then(function(data){
        // Parse and filter data to get sample names
        var name = data.names;
        // Add dropdown option for each sample
        name.forEach((sample) => {
            selector
              .append("option")
              .text(sample)
              .property("value", sample);
          });
    
    // Use first sample to build metadata and initial plots
        const firstSample = name[0];
            buildCharts(firstSample);
            buildMetadata(firstSample);
            console.log(firstSample)
        });

}

function optionChanged(newSample){

    // Update metadata with newly selected sample
    buildCharts(newSample);
    buildMetadata(newSample);
    // Update charts with newly selected sample

}

// Initialize dashboard on page load
init();

