import React from 'react';
import { Chart } from "react-charts";
import ResizableBox from "./ResizableBox";

export default function Hero() {

    const series = React.useMemo(
        () => ({
            type: "area"
        }),
        []
    );
    const axes = React.useMemo(
        () => [
            { primary: true, position: "bottom", type: "time" },
            { position: "left", type: "linear", stacked: true }
        ],
        []
    );
    const myOwnData = React.useMemo(
        () => ([
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
        ]),
        []
    );

    return (
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    {/* <img src="energy.jpg" alt="conserve energy" /> */}
                    {/* <ChartFunction name="Baloney" /> */}
                    <ResizableBox>
                        <Chart data={myOwnData} series={series} axes={axes} tooltip />
                        {/* <Chart data={this.props.} series={} axes={} tooltip /> */}
                    </ResizableBox>
                </div>
            </div>
        </section>


    )
}
