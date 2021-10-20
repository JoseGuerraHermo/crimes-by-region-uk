import { regions } from './helpers/regions.js';

const searchBar = document.querySelector('#searchBar');
const searchSuggestions = document.querySelector('#searchSuggestions');
const chartDiv = document.querySelector('.chart');
const date = new Date();
const passDate = `${date.getFullYear()}-${date.getMonth() - 1}`;

const displaySuggestions = (regions) => {
    const htmlString = regions
        .map((region) => {
            return `
            <li class="list-group-item list-group-item-light">
                <p class="getCoords" id="lat=${region.lat}&lng=${region.lng}">${region.city}</p>
            </li>
        `;
        })
        .join('');
    searchSuggestions.innerHTML = htmlString;

    if (!searchBar.value) {
        searchSuggestions.innerHTML = '';
    }
};


searchBar.addEventListener('keyup', (e) => {
    let searchTerm = e.target.value;
    let searchRegion = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    let filteredRegions = regions.filter( region => {
        return region.city.includes(searchRegion)
    })
    displaySuggestions(filteredRegions)
})



document.body.addEventListener('click', (e)=> {

    if (e.target.className == 'getCoords') {

        searchSuggestions.innerHTML = '';
        chartDiv.style.display = 'block';
        async function fetchCrimesJSON() { 
            const response = await fetch(`https://data.police.uk/api/crimes-street/all-crime?${e.target.id}&date=${passDate}`);
            const crimes = await response.json();
            return crimes;
        }
        
        fetchCrimesJSON().then(crime => {
            let listOfCrimes = crime.reduce(function (reducer, accumulator) {
                reducer[accumulator.category] = (reducer[accumulator.category] || 0) + 1;
                return reducer;
            }, {});
            chart.updateOptions({
                series: [{
                    name: "Crimes",
                    data: Object.values(listOfCrimes)
                }],
                xaxis: {
                    categories: Object.keys(listOfCrimes)
                },
                title: {
                    text: `Crimes in ${e.target.innerHTML}`
                }
            })
        }).catch(error => {
            console.log(error)
        });
    }
})

// Chart options
const options = {
    chart: {
      height: 450,
      width: "100%",
      type: "bar",
      background: "#f4f4f4",
      foreColor: "#333"
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    series: [
    ],
    xaxis: {
    },
    fill: {
      colors: ["#F44336"]
    },
    dataLabels: {
      enabled: false
    },
  
    title: {
    //   text: "Crimes in ",
      align: "center",
      margin: 20,
      offsetY: 20,
      style: {
        fontSize: "25px"
      }
    },
    noData: {
        text: 'Loading...'
      }
  };

  const chart = new ApexCharts(document.querySelector("#chart"), options);
 
  chart.render();