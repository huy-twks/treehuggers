import axios from 'axios';
import moment from 'moment';

const baseURL = "https://carbon-aware-api.azurewebsites.net"

export async function getAvgCarbonIntensityOverTime(location: string, endTime: Date) {
    const startTime =  moment(endTime).subtract(7, "days");
    let avg = 0;
    await axios.get(baseURL + '/emissions/average-carbon-intensity', 
    {
        params : 
        {
            location: location,
            startTime: startTime.toISOString() ,
            endTime: endTime.toISOString(), 
        }
    }).then(function(response){
        avg = response.data.carbonIntensity;
    });
    console.log("average: " + avg.toString());
    return avg;
}

export async function getCurrentCarbonIntensity(location: string) {
    let curr = 0;
    await axios.get(baseURL + '/emissions/bylocation', 
    {
        params : 
        {
            location: location,
        }
    }).then(function (response){
        curr = response?.data?.[0]?.rating
    }).catch(error => console.log(error));
    console.log("current: " + curr.toString());
    return curr;
}

export function isGridDirty(curr: number, avg: number) {
    console.log("current > avg : ")
    console.log(curr>avg)
    return (curr > avg); 
}