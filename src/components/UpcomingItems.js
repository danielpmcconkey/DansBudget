import React, { Component, Fragment } from 'react';
import axios from "axios";
const config = require('../config.json');
const moment = require('moment');



export default class UpcomingItems extends Component {

    token = this.props.auth.user.signInUserSession.idToken.jwtToken;
    state = {
        allRowsStateful: [],
    }
    allRows = [];
    // allRows = [
    //     {
    //         key: 0,
    //         activityDate: "activityDate",
    //         humanReadableMessage: "humanReadableMessage",
    //         cssClassName: "cssClassName"
    //     }
    // ];

    getMostRecentDataFromDBReturn = (dbReturn) => {
        var latestReport = dbReturn[0];
        for (var i = 0; i < dbReturn.length; i++) {
            if (dbReturn[i].runTime > latestReport.runTime) latestReport = dbReturn[i];
        }
        return latestReport;
    }
    formatMoney = (number) => {
        var decPlaces = 2;
        var decSep = ".";
        var thouSep = ",";
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j = (j = i.length) > 3 ? j % 3 : 0;

        return sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }
    fetchData = async () => {
        try {

            var url = `${config.api.invokeUrlSimulation}/simulations`

            const res = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'household-id': 'authVal',
                    'Authorization': `Bearer ${this.token}`
                },
                data: null
            });
            if (res.data !== undefined) {
                const paySchedule = this.getMostRecentDataFromDBReturn(res.data).paySchedule;


                // set up time bindings
                var earliestTime = moment().subtract(7, 'day');
                var latestTime = moment().add(14, 'day');


                // iterate through payment schedule and display those within the time bindings
                for (var i = 0; i < paySchedule.length; i++) {
                    var row = paySchedule[i];
                    var activityDate = moment(row.simulationRunDate);
                    if (activityDate.isBetween(earliestTime, latestTime)) {
                        var humanReadableMessage = "";
                        var cssClassName = "";

                        if (row.accountName === "Internal transfer") {
                            humanReadableMessage = row.comment;
                            cssClassName = "UpcomingItemsTransfer";
                        }
                        else if (row.comment === "Minimum payment") {
                            humanReadableMessage = `Minimum payment of $${this.formatMoney(row.debits)} to "${row.accountName}" debt`;
                            cssClassName = "UpcomingItemsOrdinaryPayment";
                        }
                        else if (row.comment === "Average monthly due") {
                            humanReadableMessage = `Estimated payment of $${this.formatMoney(row.debits)} to "${row.accountName}" bill`;
                            cssClassName = "UpcomingItemsOrdinaryPayment";
                        }
                        else if (row.accountName === "Pay day") {
                            humanReadableMessage = row.comment;
                            cssClassName = "UpcomingItemsPayDay";
                        }
                        else if (row.accountName === "Bonus day") {
                            humanReadableMessage = row.comment;
                            cssClassName = "UpcomingItemsPayDay";
                        }
                        else if (row.comment.includes("Payoff of ")) {
                            humanReadableMessage = `Pay off debt "${row.accountName}" with $${this.formatMoney(row.debits)}`;
                            cssClassName = "UpcomingItemsPayoff";
                        }
                        else if (row.comment === "Extra payment") {
                            humanReadableMessage = `Extra payment to debt "${row.accountName}" of $${this.formatMoney(row.debits)}`;
                            cssClassName = "UpcomingItemsExtraPayment";
                        }
                        else if (row.comment === "Investing surpluss cash") {
                            humanReadableMessage = `Invest surpluss cash of $${this.formatMoney(row.debits)} into "${row.accountName}"`;
                            cssClassName = "UpcomingItemsExtraPayment";
                        }
                        else {
                            humanReadableMessage = row.comment;
                            cssClassName = "UpcomingItemsUnknown";
                        }
                        var activityRow = {
                            key: this.allRows.length,
                            activityDate: activityDate,
                            humanReadableMessage: humanReadableMessage,
                            cssClassName: cssClassName
                        };
                        this.allRows.push(activityRow);
                    } // end if date is between earliest and latest
                } // end iterate through rows

                this.setState({ allRowsStateful: this.allRows });
            } // end if data != undefined
        } catch (err) {
            console.log(`An error has occurred: ${err}`);
        }

    }
    componentDidMount = () => {
        this.fetchData();
    }

    render() {
        return (
            <Fragment>
                <p className="has-text-centered">Recent and Upcoming Activities</p>
                <div className="table-container">
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th>Date</th>
                                <th>Activity</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.allRowsStateful.map(function (item, key) {

                            return (
                                <tr key={key} className={item.cssClassName}>
                                    <td>{item.activityDate.format("ddd MMM D, YYYY")}</td>
                                    <td>{item.humanReadableMessage}</td>
                                </tr>
                            )

                        })}</tbody>
                    </table>

                </div>
            </Fragment>
        )
    }
}