

// Function that will build the metadata for a single sample
function buildMetaData(sampleId) {
    
    // select location in html to put the data in
    const demogPanel = d3.select("#sample-metadata");

    //  clear any existing metadata in the metadata html elements
    demogPanel.html("")

    //  loop over the samples.json file 
    d3.json("samples.json").then((data) => {

       // - extract the metadata from the json
       // - filter the metadata for the sample id
       // - append hew header tags for each key-value pair in the filtered metadata
        var filteredArray = data.metadata.filter(row => row.id == sampleId)
        testdata=filteredArray
        Object.entries(filteredArray[0]).forEach(([key, value]) => {
            console.log(`${key.toUpperCase()}: ${value}`)
            demogPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })
    })
}


// Function that will build a bubble chart for a single sample
function buildBubbleChart(sampleId) {
    
    // - loop over the samples.json file
    d3.json("samples.json").then((data) =>{

        // - extract the samples from the json
        var extractSamples = data.samples

        // - filter the samples for the sample id
        // - extract the ids, labels, and values from the filtered result
        var filteredArray = extractSamples.filter(row => row.id == sampleId)
        var selectedSample = filteredArray[0];

        var ids = selectedSample.otu_ids
        var values = selectedSample.sample_values
        var labels = selectedSample.otu_labels


        var trace = [{
            x: ids,
            y: values,
            mode: "markers",
            text: labels,
            marker: {
                size: values,
                color: ids,
                colorscale: "Portland",
                sizeref: 1.5
            }
        }]

        var layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 0 },
            margin: { t: 30}
          };
        Plotly.newPlot("bubble", trace, layout)
    }
    )

}
// Function that will build a bar chart for a single sample
function buildBarChart(sampleId) {

    // - loop over the samples.json file
    d3.json("samples.json").then((data) =>{
        
        console.log(data)
        var extractSamples = data.samples
        var filteredArray = extractSamples.filter(row => row.id == sampleId)
        var selectedSample = filteredArray[0]
        var ids = selectedSample.otu_ids.map(id => "OTU" + id)
        var labels = selectedSample.otu_labels
        var values = selectedSample.sample_values

        var tenOTUlabels = labels.slice(0, 10)
        var tenSamples = values.slice(0, 10)


        var trace = [{
            x: tenSamples,
            y: ids,
            text: tenOTUlabels,
            type: "bar",
            orientation: "h",
            marker: {
                color: "orange"
            }
        }]

        var layout = {
            title: "Top 10 Microbial Species (OTUs)",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", trace, layout);
    });
}

// Function that will build gauge to visualize washing frequency
// function buildGauge (washfreq) {

//     let level = washfreq*20;

//     let degrees = 180- level,
//         radius = .5;
//     let radians = degrees * Math.PI / 180;
//     let x = radius * Math.cos(radians);
//     let y = radius * Math.sin(radians);

//     let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//         pathX = String(x),
//         space = ' ',
//         pathY = String(y),
//         pathEnd = ' Z';
//     let path = mainPath.concat(pathX,space,pathY,pathEnd);

//     let data = [{ type: 'scatter',
//         x: [0], y:[0],
//         marker: {size: 28, color:'850000'},
//         showlegend: false,
//         name: 'Frequency',
//         text: washfreq,
//         hoverinfo: 'text+name'
//         },
//         { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
//         rotation: 90,
//         text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
//         textinfo: 'text',
//         textposition:'inside',
//         marker: {colors:['#a50026', '#d73027','#f46d43', '#fdae61','#fee08b', 
//                         '#d9ef8b','#a6d96a', '#66bd63','#1a9850', '#006837']},
//         labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
//         hoverinfo: 'label',
//         hole: .5,
//         type: 'pie',
//         showlegend: false
//     }];

//     let layout = {
//         shapes:[{
//         type: 'path',
//         path: path,
//         fillcolor: '850000',
//         line: {
//         color: '850000'
//         }
//         }],
//         title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
//         titlefont: {family: 'Times New Roman, Times, serif'},
//         height: 520,
//         width: 520,
//         xaxis: {zeroline:false, showticklabels:false,
//              showgrid: false, range: [-1, 1]},
//         yaxis: {zeroline:false, showticklabels:false,
//              showgrid: false, range: [-1, 1]},
//         };

//     let GAUGE = document.getElementById('gauge');
//     Plotly.newPlot(GAUGE, data, layout);

}

// Function that will populate the charts/metadata and elements on the page
function init() {

    // - select the dropdown element in the page
    var selectDropdwn = d3.select("#selDataset")

    // - loop over the samples.json data to append the .name attribute into the value of an option HTML tag 
    d3.json("samples.json").then((data) =>{

        // - extract the first sample from the data
        var idNum = data.names
        idNum.forEach(id => {
            selectDropdwn.append("option").text(id).property("value", id)
            
        });

        // call two functions to build the metadata and build the charts on the first sample, 
        //so that new visitors see some data/charts before they select something from the dropdown
        var chosenSample = idNum[0];
        buildBarChart(chosenSample);
        buildBubbleChart(chosenSample);
        buildMetaData(chosenSample);
        
    });
    d3.select("#selDataset").on("change", changeSampleId);
}

// Function that takes a new sample as an argument
// This function when someone selects something on the dropdown
function changeSampleId() {

    d3.json("samples.json").then((data) =>{
        const selectMenu = d3.select("#selDataset")
        var sampleId = selectMenu.property("value")
        var index = data.names.indexOf(sampleId)

        // build the metadata and the charts on a new sample
        buildBarChart(sampleId);
        buildBubbleChart(sampleId);
        buildMetaData(sampleId);
        
    }
    )
}

// Initialize the dashboard 
init();