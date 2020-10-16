import React, { Component } from 'react';
import axios from "axios";
//import { Chart } from "react-charts";
import { Line } from "react-chartjs-2";
const config = require('../config.json');
const getMostRecentSimFromDBReturn = require('./sharedFunctions/getMostRecentSimFromDBReturn');
const moment = require('moment');



export default class WealthAreaChart2 extends Component {

    token = (this.props.auth.user === null) ? "" : this.props.auth.user.signInUserSession.idToken.jwtToken;

    state = {

        lineData: {
            labels: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032],
            datasets: [{
                label: 'High-rate debt',
                //fill: 'origin',
                lineTension: 0.5,
                backgroundColor: 'rgba(204, 0, 43, .25)',
                pointBackgroundColor: 'rgba(255, 204, 213, 0.6)',
                hoverBorderColor: 'rgba(255, 204, 213, 1)',
                pointRadius: 2,
                borderColor: 'rgba(204, 0, 43, 1)',
                borderWidth: 2,
                pointHoverBorderWidth: 15,
                data: [-32148, -32048, -31848, -31448, -30648, -29048, -25848, -19448, -6648, 0, 0, 0, 0]
            },
            {
                label: 'Low-rate debt:',
                //fill: 'origin',
                lineTension: 0.5,
                backgroundColor: 'rgba(230,115,0, .25)',
                pointBackgroundColor: 'rgba(230,115,0, 0.6)',
                hoverBorderColor: 'rgba(255,255,77, 1)',
                pointRadius: 2,
                borderColor: 'rgba(77,38,0, 1)',
                borderWidth: 2,
                pointHoverBorderWidth: 15,
                data: [-183095.2, -182095.2, -180995.2, -179785.2, -178454.2, -176990.1, -175379.59, -173608.029, -171659.3119, -169515.72309, -167157.775399, -164564.0329389, -161710.91623279]
            },
            {
                label: 'Taxable assets:',
                //fill: 'origin',
                lineTension: 0.5,
                backgroundColor: 'rgba(25,25,255, .25)',
                pointBackgroundColor: 'rgba(25,25,255, 0.6)',
                hoverBorderColor: 'rgba(25,25,255, 1)',
                pointRadius: 2,
                borderColor: 'rgba(25,25,255, 1)',
                borderWidth: 2,
                pointHoverBorderWidth: 15,
                data: [25221, 27238.68, 29417.77, 31771.19, 34312.89, 37057.92, 40022.55, 43224.35, 46682.3, 50416.88, 54450.23, 58806.25, 63510.75]
            },
            {
                label: 'Tax-advantaged assets:',
                //fill: 1,
                lineTension: 0.5,
                backgroundColor: 'rgba(34,204,0, 0.25)',
                pointBackgroundColor: 'rgba(34,204,0, 0.6)',
                hoverBorderColor: 'rgba(34,204,0, 1)',
                pointRadius: 2,
                borderColor: 'rgba(34,204,0, 1)',
                borderWidth: 2,
                pointHoverBorderWidth: 15,
                data: [51000, 57120, 63974.4, 71651.33, 80249.49, 89879.43, 100664.96, 112744.76, 126274.13, 141427.03, 158398.27, 177406.06, 198694.79]
            },
            {
                label: 'Total property value:',
                //fill: 3,
                lineTension: 0.5,
                backgroundColor: 'rgba(255,255,255, 0.3)',
                pointBackgroundColor: 'rgba(255,255,255, 0.6)',
                hoverBorderColor: 'rgba(255,255,255, 1)',
                pointRadius: 2,
                borderColor: 'rgba(55,55,55, 1)',
                borderWidth: 2,
                pointHoverBorderWidth: 15,
                data: [308000, 318472, 329300.05, 340496.25, 352073.12, 364043.61, 376421.09, 389219.41, 402452.87, 416136.27, 430284.9, 444914.59, 460041.69]
            },
            {
                label: 'Net worth:',
                //fill: 4,
                lineTension: 0.5,
                backgroundColor: 'rgba(136, 0, 204, 0.25)',
                pointBackgroundColor: 'rgba(136, 0, 204, 0.6)',
                hoverBorderColor: 'rgba(136, 0, 204, 1)',
                pointRadius: 2,
                borderColor: 'rgba(136, 0, 204, 1)',
                borderWidth: 2,
                pointHoverBorderWidth: 15,
                data: [117977.8, 131567.48, 145874.62, 161034.24, 177283.81, 195063.43, 215216.05, 239387.731, 270827.8581, 297037.4269, 317577.3546, 339156.8071, 361841.5238]
            }
            ]
        }
    }



    fetchData = async () => {
        var worthSchedule = [];
        if (this.props.worthScheduleStateful !== undefined) {
            worthSchedule = this.props.worthScheduleStateful
        }
        else {
            var url = `${config.api.invokeUrlSimulation}/sims`

            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                data: null
            });
            if (res.data !== undefined) {
                worthSchedule = getMostRecentSimFromDBReturn.getMostRecentSimFromDBReturn(res.data).worthSchedule;
            }
        }
        try {



            // set up iterator vars
            var i = 0;
            var row = {};
            var runDate = new Date();

            if (worthSchedule.length > 0) {
                const numPoints = 20;
                var iIncrement = Math.round(worthSchedule.length / numPoints);

                var xAxisLabels = [];
                var highRateDebtData = [];
                var lowRateDebtData = [];
                var taxableAssetsData = [];
                var taxAdvantagedAssetsData = [];
                var totalPropertyValueData = [];
                var totalNetWorthData = [];

                for (i = 0; i < worthSchedule.length; i += iIncrement) {
                    row = worthSchedule[i];
                    runDate = row.simulationRunDate;
                    xAxisLabels.push(new moment(runDate).format("MMM YYYY"));
                    highRateDebtData.push(row.highRateDebt * -1);   // -1 because the worth object stores debt as positive
                    lowRateDebtData.push(row.lowRateDebt * -1);   // -1 because the worth object stores debt as positive
                    taxableAssetsData.push(row.taxableAssets);
                    taxAdvantagedAssetsData.push(row.taxAdvantagedAssets);
                    totalPropertyValueData.push(row.totalPropertyValue);
                    totalNetWorthData.push(row.netWorth);
                }

                var lineData = {
                    labels: xAxisLabels,
                    datasets: [{
                        label: 'High-rate debt',
                        //fill: 'origin',
                        lineTension: 0.5,
                        backgroundColor: 'rgba(204, 0, 43, .25)',
                        pointBackgroundColor: 'rgba(255, 204, 213, 0.6)',
                        hoverBorderColor: 'rgba(255, 204, 213, 1)',
                        pointRadius: 2,
                        borderColor: 'rgba(204, 0, 43, 1)',
                        borderWidth: 2,
                        pointHoverBorderWidth: 15,
                        data: highRateDebtData
                    },
                    {
                        label: 'Low-rate debt:',
                        //fill: 'origin',
                        lineTension: 0.5,
                        backgroundColor: 'rgba(230,115,0, .25)',
                        pointBackgroundColor: 'rgba(230,115,0, 0.6)',
                        hoverBorderColor: 'rgba(255,255,77, 1)',
                        pointRadius: 2,
                        borderColor: 'rgba(77,38,0, 1)',
                        borderWidth: 2,
                        pointHoverBorderWidth: 15,
                        data: lowRateDebtData
                    },
                    {
                        label: 'Taxable assets:',
                        //fill: 'origin',
                        lineTension: 0.5,
                        backgroundColor: 'rgba(25,25,255, .25)',
                        pointBackgroundColor: 'rgba(25,25,255, 0.6)',
                        hoverBorderColor: 'rgba(25,25,255, 1)',
                        pointRadius: 2,
                        borderColor: 'rgba(25,25,255, 1)',
                        borderWidth: 2,
                        pointHoverBorderWidth: 15,
                        data: taxableAssetsData
                    },
                    {
                        label: 'Tax-advantaged assets:',
                        //fill: 1,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(34,204,0, 0.25)',
                        pointBackgroundColor: 'rgba(34,204,0, 0.6)',
                        hoverBorderColor: 'rgba(34,204,0, 1)',
                        pointRadius: 2,
                        borderColor: 'rgba(34,204,0, 1)',
                        borderWidth: 2,
                        pointHoverBorderWidth: 15,
                        data: taxAdvantagedAssetsData
                    },
                    {
                        label: 'Total property value:',
                        //fill: 3,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(255,255,255, 0.3)',
                        pointBackgroundColor: 'rgba(255,255,255, 0.6)',
                        hoverBorderColor: 'rgba(255,255,255, 1)',
                        pointRadius: 2,
                        borderColor: 'rgba(55,55,55, 1)',
                        borderWidth: 2,
                        pointHoverBorderWidth: 15,
                        data: totalPropertyValueData
                    },
                    {
                        label: 'Net worth:',
                        //fill: 4,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(136, 0, 204, 0.25)',
                        pointBackgroundColor: 'rgba(136, 0, 204, 0.6)',
                        hoverBorderColor: 'rgba(136, 0, 204, 1)',
                        pointRadius: 2,
                        borderColor: 'rgba(136, 0, 204, 1)',
                        borderWidth: 2,
                        pointHoverBorderWidth: 15,
                        data: totalNetWorthData
                    }
                    ]
                }




                this.setState({ lineData: lineData });
            }



        } catch (err) {
            this.props.onChangeMessage(`An error has while fetching chart data: ${err}`, "danger", "Error", true);
        }

    }

    componentDidMount = () => {
        if (this.props.auth.user !== null) this.fetchData();
    }

    render() {

        return (
            <>
                <Line
                    data={this.state.lineData}
                    options={{
                        title: { display: true, text: 'Assets and debts by month', fontSize: 20 },
                        legend: { display: true, position: 'right' },
                        plugins: { filler: { propagate: true } }
                    }} />

            </>
        )
    }
}