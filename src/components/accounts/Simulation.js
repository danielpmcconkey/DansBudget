import React, { Component, Fragment } from 'react';
import axios from "axios";
import WealthAreaChart from '../WealthAreaChart';
import LoaderSpinner from '../LoaderSpinner';
import PayScheduleTable from '../PayScheduleTable';
import WorthScheduleTable from '../WorthScheduleTable';
const config = require('../../config.json');
const moment = require('moment');
const multiSort = require('../sharedFunctions/multiSort');
const getMostRecentSimFromDBReturn = require('../sharedFunctions/getMostRecentSimFromDBReturn');


export default class Simulation extends Component {

    token = "";

    state = {
        isUserAuthenticated: false,
        debugMessages: [],
        payScheduleStateful: [],
        worthScheduleStateful: [],
        reactChartsData: {},
        isLoading: true
    }
    /* #region sim properties */
    assetAccounts = [];
    debtAccounts = [];
    bills = [];
    budgets = [];
    properties = [];
    employers = [];
    householdId = "authVal";
    primaryCheckingAccountId = "bec16915-06f6-4e09-b472-c54fbb0880d8";
    dailySpendAccountId = "c9fefac5-2d5e-4de2-9f88-89d343738f08";
    newInvestmentsAccountId = "8adbbfdc-ae66-4caf-809c-4c132a772c70";
    primarySavingAccountId = "37f4b17c-8ea5-468c-8ba6-93b204af53a7";
    primaryCheckingAccount = {};
    dailySpendAccount = {};
    newInvestmentsAccount = {};
    primarySavingAccount = {};
    simulationRunDate = moment();
    endDate = moment("2041-01-01");
    paySchedule = [];
    worthSchedule = [];
    billsMonthlySpend = 0;
    budgetsMonthlySpend = 0;
    budgetsDailySpend = 0;
    debtMonthlySpend = 0;
    totalDebtInterestAccrual = 0;

    /* #endregion */
    runSim = async () => {
        try {
            await this.setup();
            var simMonthlyCycleDay = moment().date();
            if (simMonthlyCycleDay > 28) simMonthlyCycleDay = 28; // not all months have a 29th day
            var firstDayOfSim = true;


            while (this.simulationRunDate <= this.endDate) {
                // run at the beginning and every month thereafter
                if (firstDayOfSim || this.simulationRunDate.date() === simMonthlyCycleDay) {
                    this.transferToDailySpendAccount();
                }

                this.dailySpend();
                this.accrueInterest();
                this.checkForPayDay();
                this.checkForBonus();
                this.payBills();

                if (this.addDaysWithoutSetting(this.simulationRunDate, 1).date() === 1)  // last day of the month
                {
                    this.tryToPayExtra();
                    this.tryToInvestExtra();
                }
                if (this.simulationRunDate.date() === 1)  // first day of the month
                {
                    this.calculateNetWorth();
                }


                this.simulationRunDate.add(1, "days");
                firstDayOfSim = false;
            }


            this.props.onChangeMessage("Simulation successful", "success");




        } catch (err) {
            this.props.onChangeMessage(`Error during simulation run: ${err}`, "danger");
        } finally {
            this.setState({ payScheduleStateful: this.paySchedule });
            this.setState({ worthScheduleStateful: this.worthSchedule });
            console.log("Fin");
            this.setState({ isLoading: false });
        }
    }


    /* #region simulation functions */
    accrueInterest = () => {
        for (var i = 0; i < this.debtAccounts.length; i++) {
            var account = this.debtAccounts[i];
            var beforeVal = account.balance;
            this.compoundDaily(account);
            var afterVal = account.balance;
            this.totalDebtInterestAccrual += (afterVal - beforeVal);
        }
        for (i = 0; i < this.assetAccounts.length; i++) {
            account = this.assetAccounts[i];
            this.compoundDaily(account);
        }
        for (i = 0; i < this.properties.length; i++) {
            var property = this.properties[i];
            this.compoundDailyProperty(property);
        }
    }
    bonusDay = (e) => {
        // first find tax and withholdings percent
        var grossPayPerPeriod = e.currentSalaryGrossAnnual / 12;
        if (e.payfrequency === "BIWEEKLY") grossPayPerPeriod = e.currentSalaryGrossAnnual / 26;
        else if (e.payfrequency === "FIRSTANDFIFTHTEENTH") grossPayPerPeriod = e.currentSalaryGrossAnnual / 24;
        else if (e.payfrequency === "MONTHLY") grossPayPerPeriod = e.currentSalaryGrossAnnual / 12;
        else if (e.payfrequency === "WEEKLY") grossPayPerPeriod = e.currentSalaryGrossAnnual / 52;

        var takeHomePercent = e.currentSalaryNetPerPaycheck / grossPayPerPeriod;
        var bonusGross = e.currentSalaryGrossAnnual * e.bonusTargetRate;
        var bonusNet = bonusGross * takeHomePercent;

        // done to accommodate weird offcycle covid bonus
        if (this.simulationRunDate.year() === 2021) {
            bonusGross *= .5;
            bonusNet *= .5;
        }
        bonusNet = this.roundToCurrency(bonusNet);
        bonusGross = this.roundToCurrency(bonusGross);

        this.primaryCheckingAccount.balance += bonusNet;
        var comment = `Bonus day from ${e.nickName}`;
        this.logPaySchedule(this.simulationRunDate, "Bonus day", 0, bonusNet, comment);

        this.contributeTo401k(e.employerRetirementAccount, this.roundToCurrency(bonusGross * e.retirementContributionRate), "401(k) contribution from employee");
        this.contributeTo401k(e.employerRetirementAccount, this.roundToCurrency(bonusGross * 0.06), "401(k) contribution from employer");   // ally doesn't give the extra 4% on bonuses

        e.mostRecentBonusDate = moment(this.simulationRunDate);
    }
    checkForBonus = () => {
        for (var i = 0; i < this.employers.length; i++) {
            var e = this.employers[i];
            if (this.addYearsWithoutSetting(this.simulationRunDate, -1).isSame(e.mostRecentBonusDate)) {
                this.bonusDay(e);
            }
        }
    }
    checkForPayDay = () => {
        for (var i = 0; i < this.employers.length; i++) {
            var e = this.employers[i];
            switch (e.payfrequency) {
                case "BIWEEKLY":
                    if (this.addDaysWithoutSetting(this.simulationRunDate, -14).isSame(e.mostRecentPayday)) {
                        this.payDay(e);
                    }
                    break;
                case "FIRSTANDFIFTHTEENTH":
                    if (this.simulationRunDate.date() === 1 || this.simulationRunDate.date() === 15) {
                        this.payDay(e);
                    }
                    break;
                case "WEEKLY":
                    if (this.simulationRunDate.day === 5) {    // assumes friday is payday
                        this.payDay(e);
                    }
                    break;
                default:
                case "MONTHLY":
                    if (this.simulationRunDate.date() === 1) {
                        this.payDay(e);
                    }
                    break;
            }
        }
    }
    checkFundsAvailabilityAndTransferIfNeededChecking = (amountDue) => {

        if (this.primaryCheckingAccount.balance < amountDue) {
            // transfer needed
            var oneMonthsBurn = this.billsMonthlySpend + this.budgetsMonthlySpend + this.debtMonthlySpend;
            var oneWeeksBurn = oneMonthsBurn * 12 / 52;
            // first try to transfer a month's worth of burn rate
            if (this.primarySavingAccount.balance > oneMonthsBurn) {
                this.transferFunds(this.primarySavingAccount, this.primaryCheckingAccount, oneMonthsBurn);
            }
            else {
                // then try to transfer a week's worth of burn
                if (this.primarySavingAccount.balance > oneWeeksBurn) {
                    this.transferFunds(this.primarySavingAccount, this.primaryCheckingAccount, oneWeeksBurn);
                }
                else {
                    // try to transfer the amount Due
                    this.transferFunds(this.primarySavingAccount, this.primaryCheckingAccount, amountDue);
                }
            }
            // finally, check to make sure you have enough to cover this bill
            // in case the amount due was greater than monthly or weekly burn
            if (this.primaryCheckingAccount.balance < amountDue) this.checkFundsAvailabilityAndTransferIfNeededChecking(amountDue);
        }
    }
    checkFundsAvailabilityAndTransferIfNeededSpend = () => {

        if (this.dailySpendAccount.balance < this.budgetsDailySpend) {
            // transfer needed. only transfer one day's worth as we have a regular transfer schedule already
            this.checkFundsAvailabilityAndTransferIfNeededChecking(this.budgetsDailySpend);
            this.transferFunds(this.primaryCheckingAccount, this.dailySpendAccount, this.budgetsDailySpend);
        }
    }
    dailySpend = () => {
        this.checkFundsAvailabilityAndTransferIfNeededSpend();
        this.debitAnAccount(this.dailySpendAccount, this.nonDebtSpendingDaily);
    }
    invest = (fromAccount, toAccount, amount, comment) => {
        if (toAccount.isOpen && fromAccount.isOpen) {
            this.debitAnAccount(fromAccount, amount);
            toAccount.balance += amount;
            this.logPaySchedule(this.simulationRunDate, toAccount.nickName, amount, amount, comment);
        }
    }
    payABill = (fromAccount, toAccount, amount, comment) => {
        if (fromAccount.isOpen && toAccount.isOpen) {
            this.debitAnAccount(fromAccount, amount);
            toAccount.lastPaidDate = moment(this.simulationRunDate);
            if (amount !== toAccount.amountDue) {
                throw new Error("Paid the wrong amount on a bill");
            }
            this.logPaySchedule(this.simulationRunDate, toAccount.nickName, amount, 0, comment);
        }
    }
    payALoan = (fromAccount, toAccount, amount, comment) => {
        if (fromAccount.isOpen && toAccount.isOpen) {
            this.debitAnAccount(fromAccount, amount);
            var change = this.makePaymentOnDebt(toAccount, amount);
            toAccount.lastPaidDate = moment(this.simulationRunDate);
            fromAccount.balance += change;

            var amountPaid = amount - change;
            if (toAccount.isOpen === false || toAccount.balance <= 0) {
                if (comment === "") comment = `Payoff of ${toAccount.nickName}`;
                else comment += ` | Payoff of ${toAccount.nickName}`;
                this.debtMonthlySpend -= toAccount.minPayment;
            }
            this.logPaySchedule(this.simulationRunDate, toAccount.nickName, amountPaid, 0, comment);
        }
    }
    payBills = () => {
        // set up iterator variables
        var i = 0;
        var a = {};
        var isDue = false;

        // check bills
        for (i = 0; i < this.bills.length; i++) {
            a = this.bills[i];
            if (a.isOpen) {
                // is it due today?
                isDue = false;
                switch (a.payFrequency) {
                    case "BIWEEKLY":
                        if (this.addDaysWithoutSetting(a.lastPaidDate, 14).isSame(this.simulationRunDate)) {
                            isDue = true;
                        }
                        break;
                    case "FIRSTANDFIFTHTEENTH":
                        if (a.lastPaidDate.date() === 1 || a.lastPaidDate.date() === 15)
                            isDue = true;
                        break;
                    case "WEEKLY":
                        if (this.addDaysWithoutSetting(a.lastPaidDate, 7).isSame(this.simulationRunDate))
                            isDue = true;
                        break;
                    default:
                    case "MONTHLY":
                        if (this.addMonthsWithoutSetting(a.lastPaidDate, 1).isSame(this.simulationRunDate))
                            isDue = true;
                        break;
                }
                if (isDue) {
                    this.checkFundsAvailabilityAndTransferIfNeededChecking(a.amountDue);
                    this.payABill(this.primaryCheckingAccount, a, a.amountDue, "Average monthly due");
                }

            }
        }
        // check debt accounts
        for (i = 0; i < this.debtAccounts.length; i++) {
            a = this.debtAccounts[i];
            if (a.isOpen) {
                // is it due today?
                isDue = false;
                switch (a.payFrequency) {
                    case "BIWEEKLY":
                        if (this.addDaysWithoutSetting(a.lastPaidDate, 14).isSame(this.simulationRunDate)) {
                            isDue = true;
                        }
                        break;
                    case "FIRSTANDFIFTHTEENTH":
                        if (a.lastPaidDate.date() === 1 || a.lastPaidDate.date() === 15)
                            isDue = true;
                        break;
                    default:
                    case "MONTHLY":
                        if (this.addMonthsWithoutSetting(a.lastPaidDate, 1).isSame(this.simulationRunDate))
                            isDue = true;
                        break;
                    case "WEEKLY":
                        if (this.addDaysWithoutSetting(a.lastPaidDate, 7).isSame(this.simulationRunDate))
                            isDue = true;
                        break;
                }
                if (isDue) {
                    this.checkFundsAvailabilityAndTransferIfNeededChecking(a.minPayment);
                    this.payALoan(this.primaryCheckingAccount, a, a.minPayment, "Minimum payment");
                }

            }
        }
    }
    payDay = (e) => {
        this.primaryCheckingAccount.balance += e.currentSalaryNetPerPaycheck;

        var comment = `Pay day from ${e.nickName}`;
        this.logPaySchedule(this.simulationRunDate, "Pay day", 0, e.currentSalaryNetPerPaycheck, comment);

        var grossPayThisPeriod = e.currentSalaryGrossAnnual / 12;
        if (e.payfrequency === "BIWEEKLY") grossPayThisPeriod = e.currentSalaryGrossAnnual / 26;
        else if (e.payfrequency === "FIRSTANDFIFTHTEENTH") grossPayThisPeriod = e.currentSalaryGrossAnnual / 24;
        else if (e.payfrequency === "MONTHLY") grossPayThisPeriod = e.currentSalaryGrossAnnual / 12;
        else if (e.payfrequency === "WEEKLY") grossPayThisPeriod = e.currentSalaryGrossAnnual / 52;
        this.contributeTo401k(e.employerRetirementAccount, (grossPayThisPeriod * e.retirementContributionRate), "401(k) contribution from employee");
        this.contributeTo401k(e.employerRetirementAccount, (grossPayThisPeriod * e.retirementMatchRate), "401(k) contribution from employer");
        e.mostRecentPayday = moment(this.simulationRunDate);
    }
    transferToDailySpendAccount = () => {
        var amount = this.roundToCurrency(this.budgetsMonthlySpend);
        this.transferFunds(this.primaryCheckingAccount, this.dailySpendAccount, amount);
    }
    tryToInvestExtra = () => {
        var amountYouCanAffordToInvest = this.primaryCheckingAccount.balance -
            this.billsMonthlySpend - this.budgetsMonthlySpend - this.debtMonthlySpend;
        if (amountYouCanAffordToInvest > 0) {
            this.invest(this.primaryCheckingAccount, this.newInvestmentsAccount, amountYouCanAffordToInvest, "Investing surpluss cash");
        }
    }
    tryToPayExtra = () => {
        for (var i = 0; i < this.debtAccounts.length; i++) {
            // array should already be sorted on rate desc
            var a = this.debtAccounts[i];
            if (a.isOpen) {
                if (a.rate > this.newInvestmentsAccount.rate) {
                    // if rate is low, put that money in an investment, instead
                    var amountYouCanAffordToPay = this.primaryCheckingAccount.balance -
                        this.budgetsMonthlySpend - this.billsMonthlySpend - this.debtMonthlySpend;
                    if (amountYouCanAffordToPay > 0) {
                        this.payALoan(this.primaryCheckingAccount, a, amountYouCanAffordToPay, "Extra payment");
                    }
                }
            }
        }
    }
    /* #endregion */

    /* #region set-up functions */
    assignHouseholdAccounts = () => {
        var i = 0;
        for (i = 0; i < this.assetAccounts.length; i++) {
            var a = this.assetAccounts[i];

            if (a.assetAccountId === this.primaryCheckingAccountId) this.primaryCheckingAccount = a;
            if (a.assetAccountId === this.dailySpendAccountId) this.dailySpendAccount = a;
            if (a.assetAccountId === this.newInvestmentsAccountId) this.newInvestmentsAccount = a;
            if (a.assetAccountId === this.primarySavingAccountId) this.primarySavingAccount = a;

            for (var j = 0; j < this.employers.length; j++) {
                if (a.assetAccountId === this.employers[j].employerRetirementAccount) {
                    this.employers[j].employerRetirementAccount = a;
                }
            }
        }
    }
    calculateBurnRates = () => {
        var i = 0;
        var a = {};
        // first budgets
        for (i = 0; i < this.budgets.length; i++) {
            a = this.budgets[i];
            this.budgetsMonthlySpend += a.amount;
        }
        this.budgetsDailySpend = this.roundToCurrency(this.budgetsMonthlySpend * 12 / 365.25);

        // then bills
        for (i = 0; i < this.bills.length; i++) {
            a = this.bills[i];
            this.billsMonthlySpend += a.amountDue;
        }
        this.billssDailySpend = this.roundToCurrency(this.billsMonthlySpend * 12 / 365.25);

        // then debts
        for (i = 0; i < this.debtAccounts.length; i++) {
            a = this.debtAccounts[i];
            this.debtMonthlySpend += a.minPayment;
        }
    }
    fetchAll = async () => {
        this.assetAccounts = await this.multiFetch(`${config.api.invokeUrlAssetAccount}/asset-accounts`);
        this.debtAccounts = await this.multiFetch(`${config.api.invokeUrlDebtAccount}/debt-accounts`);
        this.bills = await this.multiFetch(`${config.api.invokeUrlBill}/bills`);
        this.budgets = await this.multiFetch(`${config.api.invokeUrlBudget}/budgets`);
        this.properties = await this.multiFetch(`${config.api.invokeUrlProperty}/properties`);
        this.employers = await this.multiFetch(`${config.api.invokeUrlEmployer}/employers`);
        // sort debts by balance decending so you pay the highest off first
        this.debtAccounts = multiSort.multiSort(this.debtAccounts, "rate", false);
        // calculate debtMonthlySpend
        for (var i = 0; i < this.debtAccounts.length; i++) {
            this.debtMonthlySpend += this.debtAccounts[i].minPayment;
        }
    }
    multiFetch = async (url) => {
        // fetch from any of the budget API get all endpoints
        const res = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'household-id': this.householdId,
                'Authorization': `Bearer ${this.token}`
            },
            data: null
        });
        return res.data;
    }
    resetDateToMidnight = (inDate) => {
        var outDate = moment(inDate);
        outDate.millisecond(0);
        outDate.second(0);
        outDate.minute(0);
        outDate.hour(0);
        return outDate;
    }
    setAllDatesToMidnight = () => {
        var i = 0;
        var a = {};
        for (i = 0; i < this.debtAccounts.length; i++) {
            a = this.debtAccounts[i];
            a.lastPaidDate = this.resetDateToMidnight(a.lastPaidDate);
        }
        for (i = 0; i < this.bills.length; i++) {
            a = this.bills[i];
            a.lastPaidDate = this.resetDateToMidnight(a.lastPaidDate);
        }
        for (i = 0; i < this.employers.length; i++) {
            a = this.employers[i];
            a.mostRecentBonusDate = this.resetDateToMidnight(a.mostRecentBonusDate);
            a.mostRecentPayday = this.resetDateToMidnight(a.mostRecentPayday);
        }
        this.simulationRunDate = this.resetDateToMidnight(this.simulationRunDate);
        this.endDate = this.resetDateToMidnight(this.endDate);
    }
    setup = async () => {
        // fetch all data from DB and assign it to this
        await this.fetchAll();
        this.setAllDatesToMidnight();
        this.calculateBurnRates();
        this.assignHouseholdAccounts();

    }
    /* #endregion */

    /* #region utility functions */
    addDaysWithoutSetting = (inMoment, num) => {
        return this.addTimeWithoutSetting(inMoment, num, "days");
    }
    addMonthsWithoutSetting = (inMoment, num) => {
        return this.addTimeWithoutSetting(inMoment, num, "months");
    }
    addTimeWithoutSetting = (inMoment, num, interval) => {
        // clone inDate so you don't set inDate's value when you add
        var cloneDate = inMoment.clone();
        cloneDate.add(num, interval);
        return cloneDate;
    }
    addYearsWithoutSetting = (inMoment, num) => {
        return this.addTimeWithoutSetting(inMoment, num, "years");
    }
    calculateNetWorth = () => {

        var highRateDebt = 0;
        var lowRateDebt = 0;
        var taxAdvantagedAssets = 0;
        var taxableAssets2 = 0;
        var totalPropertyValue = 0;
        var totalNetWorth = 0;

        var i = 0;
        var a = {};

        for (i = 0; i < this.debtAccounts.length; i++) {
            a = this.debtAccounts[i];
            if (a.rate <= 0.05) lowRateDebt += a.balance;
            else highRateDebt += a.balance;
        }
        for (i = 0; i < this.assetAccounts.length; i++) {
            a = this.assetAccounts[i];
            if (a.isTaxAdvantaged === "NO") {
                if (a.balance > 0) taxableAssets2 += a.balance;
                else if (a.balance < 0 || a.balance === null || a.balance === undefined)
                    throw new Error(`null or negative balance in asset account: ${a.nickName}`);
            }
            else taxAdvantagedAssets += a.balance;

        }
        for (i = 0; i < this.properties.length; i++) {
            totalPropertyValue += this.properties[i].homeValue;
        }

        totalNetWorth = taxableAssets2 + taxAdvantagedAssets + totalPropertyValue - highRateDebt - lowRateDebt;
        var worthObject = {
            key: this.worthSchedule.length,
            simulationRunDate: this.simulationRunDate.format("YYYY-MM-DD"),
            highRateDebt: this.roundToCurrency(highRateDebt),
            lowRateDebt: this.roundToCurrency(lowRateDebt),
            taxableAssets: this.roundToCurrency(taxableAssets2),
            taxAdvantagedAssets: this.roundToCurrency(taxAdvantagedAssets),
            totalPropertyValue: this.roundToCurrency(totalPropertyValue),
            netWorth: this.roundToCurrency(totalNetWorth),
        }
        this.worthSchedule.push(worthObject);
    }
    compoundDaily = (account) => {
        var interest = account.balance * (account.rate / 365.25);
        account.balance += this.roundToCurrency(interest);
    }
    compoundDailyProperty = (property) => {
        var interest = property.homeValue * (property.housingValueIncreaseRate / 365.25);
        property.homeValue += this.roundToCurrency(interest);
    }
    contributeTo401k = (toAccount, amount, comment) => {
        if (toAccount.isOpen) {
            toAccount.balance += amount;
            this.logPaySchedule(this.simulationRunDate, toAccount.nickName, 0, amount, comment);
        }
    }
    debitAnAccount = (account, amount) => {
        account.balance -= amount;
        if (account.balance < 0) {
            throw new Error(`Overdrawn on account ${account.nickName}`);
        }
    }
    formatMoney = (number) => {
        var decPlaces = 2;
        var decSep = ".";
        var thouSep = ",";
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j = 0;
        j = (j = i.length) > 3 ? j % 3 : 0;

        return sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }
    logPaySchedule = (inDate, accountName, debits, credits, comment) => {
        var logObject = {
            key: this.paySchedule.length,
            simulationRunDate: inDate.format("YYYY-MM-DD"),
            accountName: accountName,
            debits: this.roundToCurrency(debits),
            credits: this.roundToCurrency(credits),
            checkingBal: this.roundToCurrency(this.primaryCheckingAccount.balance),
            savingsBal: this.roundToCurrency(this.primarySavingAccount.balance),
            comment: comment
        }
        this.paySchedule.push(logObject);
    }
    makePaymentOnDebt = (debtAccount, amount) => {
        var change = 0;
        debtAccount.balance -= amount;
        if (debtAccount.balance <= 0) {
            change = 0 - debtAccount.balance;
            debtAccount.balance = 0;
            debtAccount.isOpen = false;
        }
        return change;
    }
    roundToCurrency = (inVal) => {
        // math.round only rounds to whole numbers. 
        //      So, first, multiply by 100
        //      then round
        //      then divide by 100
        var roundVal = inVal * 100;
        roundVal = Math.round(roundVal);
        roundVal = roundVal / 100;
        return roundVal;
    }
    saveSimData = async () => {
        var nextYearsPaySchedule = [];
        var twoMonthsFromNow = moment().add(2, 'months');

        for (var i = 0; i < this.paySchedule.length; i++) {
            var p = this.paySchedule[i];
            if (moment(p.simulationRunDate).isSameOrBefore(twoMonthsFromNow)) {
                nextYearsPaySchedule.push(p);
            }
        }
        try {
            const params = {
                "simulationId": 'newVal',
                "householdId": "headerVal",
                "paySchedule": nextYearsPaySchedule,
                "worthSchedule": this.worthSchedule
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            const res = await axios.post(`${config.api.invokeUrlSimulation}/sims`, params, { headers: headers });
            this.props.onChangeMessage("Simulation data saved", "success");

        } catch (err) {
            console.log(`Unable to add simulation: ${err}`);
            this.props.onChangeMessage(`Unable to save simulation data: ${err}`, "danger");
        }
    }
    transferFunds = (fromAccount, toAccount, amount) => {
        var comment = `Transfer from ${fromAccount.nickName} to ${toAccount.nickName} of $${this.formatMoney(amount)}`;
        this.debitAnAccount(fromAccount, amount);
        toAccount.balance += amount;
        this.logPaySchedule(this.simulationRunDate, "Internal transfer", amount, amount, comment);
    }
    /* #endregion */

    /* #region rendering */
    componentDidMount = () => {
        if (this.props.auth.user !== null) {
            this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
            this.setState(
                { isUserAuthenticated: true }
            );
            this.runSim();
        }

    }
    handleSaveSimData = event => {
        event.preventDefault();
        this.saveSimData();
    }

    render() {


        return (
            <Fragment>
                { this.state.isUserAuthenticated ?
                    <div>
                        {this.state.isLoading ?
                            <p>Simulation running. Please wait.</p>
                            :
                            <div className="field has-addons">
                                <div className="control">
                                    <button type="submit" onClick={this.handleSaveSimData} className="button is-primary is-medium">
                                        Save simulation results
                                </button>
                                </div>
                            </div>
                        }
                        {this.state.isLoading ? <LoaderSpinner /> : <WealthAreaChart auth={this.props.auth} />}
                        {this.state.isLoading ? <LoaderSpinner /> : <PayScheduleTable payScheduleStateful={this.state.payScheduleStateful} />}
                        {this.state.isLoading ? <LoaderSpinner /> : <WorthScheduleTable worthScheduleStateful={this.state.worthScheduleStateful} />}
                    </div>
                    : <div><p>You must log in to view this content</p></div>
                }

            </Fragment>
        );
    }
    /* #endregion */
}
