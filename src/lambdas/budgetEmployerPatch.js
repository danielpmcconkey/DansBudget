'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    let params = null;
    let householder7 = "";


    const loggedInUSer = event.requestContext.authorizer.claims['cognito:username'];
    const employerId = (event.pathParameters == undefined) ? undefined : event.pathParameters['employer-id'].toString();
    const {
        bonusTargetRate,
        currentSalaryGrossAnnual,
        currentSalaryNetPerPaycheck,
        employerRetirementAccount,
        //householder7,
        mostRecentBonusDate,
        mostRecentPayday,
        nickName,
        payFrequency,
        retirementContributionRate,
        retirementMatchRate
    } = JSON.parse(event.body);

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
            householder7 = userData.Item.householdId;

            /*
            * todo: validate household_id is associated with the record being deleted
            */



            params = {
                TableName: "employer",
                Key: {
                    employerId: employerId
                },
                UpdateExpression: `set 
                    bonusTargetRate = :bonusTargetRate,
                    currentSalaryGrossAnnual = :currentSalaryGrossAnnual,
                    currentSalaryNetPerPaycheck = :currentSalaryNetPerPaycheck,
                    employerRetirementAccount = :employerRetirementAccount,
                    householder7 = :householder7,
                    mostRecentBonusDate = :mostRecentBonusDate,
                    mostRecentPayday = :mostRecentPayday,
                    nickName = :nickName,
                    payFrequency = :payFrequency,
                    retirementContributionRate = :retirementContributionRate,
                    retirementMatchRate = :retirementMatchRate`,
                ExpressionAttributeValues: {
                    ":bonusTargetRate": bonusTargetRate,
                    ":currentSalaryGrossAnnual": currentSalaryGrossAnnual,
                    ":currentSalaryNetPerPaycheck": currentSalaryNetPerPaycheck,
                    ":employerRetirementAccount": employerRetirementAccount,
                    ":householder7": householder7,
                    ":mostRecentBonusDate": mostRecentBonusDate,
                    ":mostRecentPayday": mostRecentPayday,
                    ":nickName": nickName,
                    ":payFrequency": payFrequency,
                    ":retirementContributionRate": retirementContributionRate,
                    ":retirementMatchRate": retirementMatchRate
                },
                ReturnValues: "UPDATED_OLD"
            };

            const data = await documentClient.update(params).promise();
            responseBody = JSON.stringify(data);
            statusCode = 204;
        } catch (err) {
            responseBody = `Unable to update employer: ${err}`;
            statusCode = 403;
        }
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*"
        },
        body: responseBody,
    };
    return response;

};