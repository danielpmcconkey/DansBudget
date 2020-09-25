'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    let params = null;
    let data = null;
    let newObject = {};

    const loggedInUSer = event.requestContext.authorizer.claims['cognito:username'];
    var {
        bonusTargetRate,
        currentSalaryGrossAnnual,
        currentSalaryNetPerPaycheck,
        employerRetirementAccount,
        householdId,
        mostRecentBonusDate,
        mostRecentPayday,
        nickName,
        payFrequency,
        retirementContributionRate,
        retirementMatchRate
    } = JSON.parse(event.body);
    const employerId = context.awsRequestId;

    if (loggedInUSer == null || loggedInUSer == undefined || loggedInUSer === "") {
        statusCode = 401;
        responseBody = "Unauthorized";
    }
    else {
        try {

            // get household-id from users
            params = {
                TableName: "user",
                Key: {
                    "userName": loggedInUSer
                }
            };
            var userData = await documentClient.get(params).promise();
            householdId = userData.Item.householdId;


            newObject = {
                bonusTargetRate: bonusTargetRate,
                currentSalaryGrossAnnual: currentSalaryGrossAnnual,
                currentSalaryNetPerPaycheck: currentSalaryNetPerPaycheck,
                employerRetirementAccount: employerRetirementAccount,
                householdId: householdId,
                mostRecentBonusDate: mostRecentBonusDate,
                mostRecentPayday: mostRecentPayday,
                nickName: nickName,
                payFrequency: payFrequency,
                retirementContributionRate: retirementContributionRate,
                retirementMatchRate: retirementMatchRate,
                employerId: employerId
            };
            params = {
                TableName: "employer",
                Item: newObject
            };

            data = await documentClient.put(params).promise();
            responseBody = JSON.stringify(newObject);
            statusCode = 201;
        } catch (err) {
            responseBody = `Unable to create employer: ${err}`;
            statusCode = 403;
        }
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody,
    };
    return response;

};