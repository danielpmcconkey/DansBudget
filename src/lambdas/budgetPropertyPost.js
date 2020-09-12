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
    var { homeValue, householdId, housingValueIncreaseRate, nickName } = JSON.parse(event.body);
    const propertyId = context.awsRequestId;

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
                homeValue: homeValue,
                householdId: householdId,
                housingValueIncreaseRate: housingValueIncreaseRate,
                nickName: nickName,
                propertyId: propertyId
            };
            params = {
                TableName: "property",
                Item: newObject
            };

            data = await documentClient.put(params).promise();
            responseBody = JSON.stringify(newObject);
            statusCode = 201;
        } catch (err) {
            responseBody = `Unable to create property: ${err}`;
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