import React, { Component, Fragment } from 'react';
import axios from "axios";
import ResizableBox from './ResizableBox';
import { Chart } from "react-charts";
const config = require('../config.json');



export default class WealthAreaChart extends Component {

    token = (this.props.auth.user === null) ? "" : this.props.auth.user.signInUserSession.idToken.jwtToken;

    state = {
        series: { type: "area" },
        axes: [
            { primary: true, position: "bottom", type: "time" },
            { position: "left", type: "linear", stacked: true }
        ],
        data: [],
        householdId: 'authVal'
    }

    setPlaceholderData = async () => {
        const placeholder3 = [
            {
                label: "highRateDebt",
                data: [
                    { primary: new Date("2020-10-01T00:00:00.000Z"), secondary: -69186.27 },
                    { primary: new Date("2028-10-01T00:00:00.000Z"), secondary: -29445.20 },
                    { primary: new Date("2036-10-01T00:00:00.000Z"), secondary: -13744.60 },
                    { primary: new Date("2040-10-01T00:00:00.000Z"), secondary: 0 * -1 }
                ]
            },
            {
                label: "lowRateDebt",
                data: [
                    { primary: new Date("2020-10-01T00:00:00.000Z"), secondary: -351028.64 },
                    { primary: new Date("2028-10-01T00:00:00.000Z"), secondary: -220803.74 },
                    { primary: new Date("2036-10-01T00:00:00.000Z"), secondary: -150123 },
                    { primary: new Date("2040-10-01T00:00:00.000Z"), secondary: -0.01 }
                ]
            },
            {
                label: "taxableAssets",
                data: [{ primary: new Date("2020-10-01T00:00:00.000Z"), secondary: 17273.18 },
                { primary: new Date("2028-10-01T00:00:00.000Z"), secondary: 104558.44 },
                { primary: new Date("2036-10-01T00:00:00.000Z"), secondary: 338922.41 },
                { primary: new Date("2040-10-01T00:00:00.000Z"), secondary: 555477.41 }
                ]
            }, {
                label: "taxAdvantagedAssets",
                data: [
                    { primary: new Date("2020-10-01T00:00:00.000Z"), secondary: 20020.41 },
                    { primary: new Date("2028-10-01T00:00:00.000Z"), secondary: 55873.12 },
                    { primary: new Date("2036-10-01T00:00:00.000Z"), secondary: 130221.21 },
                    { primary: new Date("2040-10-01T00:00:00.000Z"), secondary: 186918.01 }
                ]
            }, {
                label: "totalPropertyValue",
                data: [
                    { primary: new Date("2020-10-01T00:00:00.000Z"), secondary: 308506.34 },
                    { primary: new Date("2028-10-01T00:00:00.000Z"), secondary: 376808.03 },
                    { primary: new Date("2036-10-01T00:00:00.000Z"), secondary: 437771.17 },
                    { primary: new Date("2040-10-01T00:00:00.000Z"), secondary: 508632.31 }
                ]
            }
        ];
        this.setState({ data: placeholder3 });
    }
    getMostRecentDataFromDBReturn = (dbReturn) => {
        var latestReport = dbReturn[0];
        for (var i = 0; i < dbReturn.length; i++) {
            if (dbReturn[i].runTime > latestReport.runTime) latestReport = dbReturn[i];
        }
        return latestReport;
    }
    fetchData = async () => {
        try {

            var url = `${config.api.invokeUrlSimulation}/sims`

            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                data: null
            });

            // set up iterator vars
            var i = 0;
            var row = {};
            var runDate = new Date();
            var value = 0;

            if (res.data !== undefined) {
                const worthSchedule = this.getMostRecentDataFromDBReturn(res.data).worthSchedule;
                var dbData = [];
                // high rate debt
                var highRateDebtData = [];
                for (i = 0; i < worthSchedule.length; i++) {
                    row = worthSchedule[i];
                    runDate = row.simulationRunDate;
                    value = (row.highRateDebt === 0) ? -0.001 : row.highRateDebt;
                    highRateDebtData.push({ primary: new Date(runDate), secondary: value * -1 });
                }
                var highRateDebt = {
                    label: "highRateDebt",
                    data: highRateDebtData
                };
                dbData.push(highRateDebt);

                // low rate debt
                var lowRateDebtData = [];
                for (i = 0; i < worthSchedule.length; i++) {
                    row = worthSchedule[i];
                    runDate = row.simulationRunDate;
                    value = (row.lowRateDebt === 0) ? -0.001 : row.lowRateDebt;
                    lowRateDebtData.push({ primary: new Date(runDate), secondary: value * -1 });
                }
                var lowRateDebt = {
                    label: "lowRateDebt",
                    data: lowRateDebtData
                };
                dbData.push(lowRateDebt);

                // taxable assets
                var taxableAssetsData = [];
                for (i = 0; i < worthSchedule.length; i++) {
                    row = worthSchedule[i];
                    runDate = row.simulationRunDate;
                    value = row.taxableAssets;
                    taxableAssetsData.push({ primary: new Date(runDate), secondary: value });
                }
                var taxableAssets = {
                    label: "taxableAssets",
                    data: taxableAssetsData
                };
                dbData.push(taxableAssets);

                // tax advantaged assets
                var taxAdvantagedAssetsData = [];
                for (i = 0; i < worthSchedule.length; i++) {
                    row = worthSchedule[i];
                    runDate = row.simulationRunDate;
                    value = row.taxAdvantagedAssets;
                    taxAdvantagedAssetsData.push({ primary: new Date(runDate), secondary: value });
                }
                var taxAdvantagedAssets = {
                    label: "taxAdvantagedAssets",
                    data: taxAdvantagedAssetsData
                };
                dbData.push(taxAdvantagedAssets);

                // total property value
                var totalPropertyValueData = [];
                for (i = 0; i < worthSchedule.length; i++) {
                    row = worthSchedule[i];
                    runDate = row.simulationRunDate;
                    value = row.totalPropertyValue;
                    totalPropertyValueData.push({ primary: new Date(runDate), secondary: value });
                }
                var totalPropertyValue = {
                    label: "totalPropertyValue",
                    data: totalPropertyValueData
                };
                dbData.push(totalPropertyValue);

                this.setState({ data: dbData });
            }

            // console.log(`db data: ${JSON.stringify(dbData)}`);

        } catch (err) {
            console.log(`An error has occurred: ${err}`);
        }

    }

    componentDidMount = () => {
        if (this.props.auth.user === null) this.setPlaceholderData();
        else this.fetchData();
    }

    render() {
        return (
            <Fragment>

                <ResizableBox>
                    <Chart data={this.state.data} series={this.state.series} axes={this.state.axes} tooltip />
                </ResizableBox>
            </Fragment>
        )
    }
}