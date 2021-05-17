
// Function that will build the metadata for a single sample
function buildMetaData(sampleId) {

    // select location in html to put the data in
    const showData = d3.select("#sample-metadata");

    //  clear any existing metadata in the metadata html elements
    showData.html("")

    //  loop over the samples.json file 
    d3.json("samples.json").then((data) => {

       // - extract the metadata from the json
       // - filter the metadata for the sample id
       // - append hew header tags for each key-value pair in the filtered metadata
        var result = data.metadata.filter(row => row.sampleId == sampleId)
        Object.entries(result[0]).forEach(([key, value]) => {
            showData.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    })
}


// Function that will build a bubble chart for a single sample
function buildBubbleChart(sampleId) {
    
    // - loop over the samples.json file
    d3.json("samples.json").then((data) =>{

        // - extract the samples from the json
        var samples = data.samples

        // - filter the samples for the sample id
        // - extract the ids, labels, and values from the filtered result
        var resultArray = samples.filter(row => row.id == id)
        var result = resultArray[0]
        var otu_ids = result.otu_ids
        var sample_values = result.sample_values
        var otu_labels = result.otu_labels


        var trace = [{
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Portland",
                sizeref: 1.5
            }
        }]

        Plotly.newPlot("bubble", trace)
    }
    )


// Function that will build a bar chart for a single sample
function buildBarChart(sampleId) {

    // - loop over the samples.json file
    d3.json("samples.json").then((data) =>{
        console.log(data)
        var samples = data.samples
        var resultArray = samples.filter(row => row.id == id)
        var result = resultArray[0]
        var otu_ids = result.otu_ids.map(id => "OTU" + id)
        var otu_labels = result.otu_labels
        var sample_values = result.sample_values

        var otu_labels_10 = otu_labels.slice(0, 10)
        var value_10 = sample_values.slice(0, 10)


        var trace = [{
            x: value_10,
            y: otu_ids,
            text: otu_labels_10,
            type: "bar",
            orientation: "h",
            marker: {
                color: "orange"
            }
        }]

        var bar_layout = {
            title: "Top 10 microbial species (OTUs)"
        }
        Plotly.newPlot("bar", trace, bar_layout)
        
    }
    )
}


// Function that will populate the charts/metadata and elements on the page
function init() {

    // - select the dropdown element in the page
    var selectDropdwn = d3.select("#selDataset");

    // - loop over the samples.json data to append the .name attribute into the value of an option HTML tag 
    d3.json("samples.json").then((data) =>{

        // - extract the first sample from the data
        var idNum = data.names;
        idNum.forEach(id => {
            selectDropdwn.append("option").text(id).property("value", id)
            
        }
        )

        // call two functions to build the metadata and build the charts on the first sample, 
        //so that new visitors see some data/charts before they select something from the dropdown
        buildBarChart();
        buildBubbleChart();
        buildMetaData();
        
    })
}

// Function that takes a new sample as an argument
// This function when someone selects something on the dropdown
function optionChanged() {

    d3.json("samples.json").then((data) =>{
        const selectMenu = d3.select("#selDataset");
        var id = selectMenu.property("value");
        var index = data.names.indexOf(id)

        // build the metadata and the charts on a new sample
        buildBarChart(id)
        buildBubbleChart(id)
        buildMetadata(id)
        }
        )
        
    }
    d3.select("#selDataset").on("change", IDchange);
}

// Initialize the dashboard 
init()