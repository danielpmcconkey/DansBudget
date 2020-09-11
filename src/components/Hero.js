import React, { useState } from 'react';
import WealthAreaChart from './WealthAreaChart';
import ResizableBox from './ResizableBox';
import axios from "axios";
import Cookies from 'js-cookie';
import { Auth } from 'aws-amplify';

const config = require('../config.json');



export default function Hero(props) {

    const householdId = Cookies.get('householdid');
    const token = props.auth.user.signInUserSession.idToken.jwtToken;
    
  
    var reactChartsObject = {};
        reactChartsObject.series = { type: "area" }
        reactChartsObject.axes = [
            { primary: true, position: "bottom", type: "time" },
            { position: "left", type: "linear", stacked: true }
        ]
        reactChartsObject.data = [
            {
                label: "highRateDebt",
                data: [
                    { primary: new Date("2020-10-01"), secondary: -81512.12 },
                    { primary: new Date("2020-11-01"), secondary: -74904.8 },
                    { primary: new Date("2020-12-01"), secondary: -71579.79 },
                    { primary: new Date("2021-01-01"), secondary: -68156.62 },
                ]
            },
            {
                label: "lowRateDebt",
                data: [
                    { primary: new Date("2020-10-01"), secondary: -201345.17 },
                    { primary: new Date("2020-11-01"), secondary: -200418.79 },
                    { primary: new Date("2020-12-01"), secondary: -199470.39 },
                    { primary: new Date("2021-01-01"), secondary: -198538.9 },
                ]
            },
            {
                label: "taxableAssets",
                data: [
                    { primary: new Date("2020-10-01"), secondary: 19879.09 },
                    { primary: new Date("2020-11-01"), secondary: 20397.6 },
                    { primary: new Date("2020-12-01"), secondary: 20284.81 },
                    { primary: new Date("2021-01-01"), secondary: 20051.58 },
                ]
            },
            {
                label: "taxAdvantagedAssets",
                data: [
                    { primary: new Date("2020-10-01"), secondary: 191125.13 },
                    { primary: new Date("2020-11-01"), secondary: 195025.44 },
                    { primary: new Date("2020-12-01"), secondary: 197936.97 },
                    { primary: new Date("2021-01-01"), secondary: 200896.49 },
                ]
            },
            {
                label: "totalPropertyValue",
                data: [
                    { primary: new Date("2020-10-01"), secondary: 308527.46 },
                    { primary: new Date("2020-11-01"), secondary: 309182.78 },
                    { primary: new Date("2020-12-01"), secondary: 309818.28 },
                    { primary: new Date("2021-01-01"), secondary: 310476.34 },
                ]
            },
        ]
    
        const fetchSimulationData = async (setSimDate) => {
            try {
                let mounted = true;
                console.log(`token2: ${JSON.stringify(token)}`);
                var url = `${config.api.invokeUrlSimulation}/simulations`
                if(mounted){
                const res = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'household-id': householdId,
                        'Authorization': `Bearer ${token}`
                    },
                    data: null
                });
                console.log(`sim data2: ${JSON.stringify(res.data[0].worthSchedule)}`);

                const worthSchedule = res.data[0].worthSchedule;
                var dbData = [];
                // high rate debt
                var highRateDebtData = [];
                for(var i = 0; i < worthSchedule.length; i++){
                    var row = worthSchedule[i];
                    var runDate = row.simulationRunDate;
                    var value = row.highRateDebt;
                    highRateDebtData.push({ primary: new Date(runDate), secondary: value *-1 });
                }
                var highRateDebt = {
                    label: "highRateDebt",
                    data: highRateDebtData
                };
                dbData.push(highRateDebt);

                // low rate debt
                var lowRateDebtData = [];
                for(var i = 0; i < worthSchedule.length; i++){
                    var row = worthSchedule[i];
                    var runDate = row.simulationRunDate;
                    var value = row.lowRateDebt;
                    lowRateDebtData.push({ primary: new Date(runDate), secondary: value *-1 });
                }
                var lowRateDebt = {
                    label: "lowRateDebt",
                    data: lowRateDebtData
                };
                dbData.push(lowRateDebt);

                // taxable assets
                var taxableAssetsData = [];
                for(var i = 0; i < worthSchedule.length; i++){
                    var row = worthSchedule[i];
                    var runDate = row.simulationRunDate;
                    var value = row.taxableAssets;
                    taxableAssetsData.push({ primary: new Date(runDate), secondary: value });
                }
                var taxableAssets = {
                    label: "taxableAssets",
                    data: taxableAssetsData
                };
                dbData.push(taxableAssets);

                 // tax advantaged assets
                 var taxAdvantagedAssetsData = [];
                 for(var i = 0; i < worthSchedule.length; i++){
                     var row = worthSchedule[i];
                     var runDate = row.simulationRunDate;
                     var value = row.taxAdvantagedAssets;
                     taxAdvantagedAssetsData.push({ primary: new Date(runDate), secondary: value });
                 }
                 var taxAdvantagedAssets = {
                     label: "taxAdvantagedAssets",
                     data: taxAdvantagedAssetsData
                 };
                 dbData.push(taxAdvantagedAssets);

                // total property value
                var totalPropertyValueData = [];
                for(var i = 0; i < worthSchedule.length; i++){
                    var row = worthSchedule[i];
                    var runDate = row.simulationRunDate;
                    var value = row.totalPropertyValue;
                    totalPropertyValueData.push({ primary: new Date(runDate), secondary: value });
                }
                var totalPropertyValue = {
                    label: "totalPropertyValue",
                    data: totalPropertyValueData
                };
                dbData.push(totalPropertyValue);

                var reactChartsObject = {};
                reactChartsObject.series = { type: "area" }
                reactChartsObject.axes = [
                    { primary: true, position: "bottom", type: "time" },
                    { position: "left", type: "linear", stacked: true }
                ]
                reactChartsObject.data = dbData;
                
                    setSimDate(reactChartsObject);
                }

                return () => mounted = false;
    
            } catch (err) {
                console.log(`An error has occurred: ${err}`);
            }
        }

        var emptyObject = {};
        const [simData, setSimDate] = useState({ emptyObject });
        fetchSimulationData(setSimDate);
        console.log(`sim data: ${JSON.stringify(simData)}`);
    return (
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    {/* <img src="energy.jpg" alt="conserve energy" /> */}
                    {/* <ChartFunction name="Baloney" /> */}
                    <ResizableBox>
                        <WealthAreaChart data={simData} />
                        {/* <Chart data={this.props.} series={} axes={} tooltip /> */}
                    </ResizableBox>
                </div>
            </div>
        </section>


    )
}
