'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    let params = null;
    let data = null;
    let household_id = "";

    const employer_id = (event.pathParameters == undefined) ? undefined : event.pathParameters['employer-id'];
    const loggedInUSer = event.requestContext.authorizer.claims['cognito:username'];



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
            household_id = userData.Item.householdId;

            if (employer_id == undefined) {
                params = {
                    TableName: "employer",
                    FilterExpression: "#household = :hhpath",
                    ExpressionAttributeNames: { "#household": "householdId" },
                    ExpressionAttributeValues: { ":hhpath": household_id }
                };
                data = await documentClient.scan(params).promise();
                responseBody = JSON.stringify(data.Items);
            }
            else {
                params = {
                    TableName: "employer",
                    Key: {
                        "employerId": employer_id
                    }
                };
                data = await documentClient.get(params).promise();
                responseBody = JSON.stringify(data);
            }

            statusCode = 200;
        } catch (err) {
            responseBody = `Unable to get employers: ${err}`;
            statusCode = 403;
        }
    }
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type, household-id, Access-Control-Allow-Origin, access-control-allow-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        body: responseBody,
    };
    return response;
};