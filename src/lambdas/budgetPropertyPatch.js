'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {

    const documentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    let params = null;
    let data = null;
    let household_id = "";

    const loggedInUSer = event.requestContext.authorizer.claims['cognito:username'];
    const propertyId = (event.pathParameters == undefined) ? undefined : event.pathParameters['property-id'].toString();
    var { householdId, homeValue, nickName, housingValueIncreaseRate } = JSON.parse(event.body);

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

            /*
            * todo: validate household_id is associated with the record being deleted
            */



            params = {
                TableName: "property",
                Key: {
                    propertyId: propertyId
                },
                UpdateExpression: "set homeValue = :v, nickName = :n, housingValueIncreaseRate = :housingValueIncreaseRate",
                ExpressionAttributeValues: {
                    ":v": homeValue,
                    ":n": nickName,
                    ":housingValueIncreaseRate": housingValueIncreaseRate
                },
                ReturnValues: "UPDATED_OLD"
            };

            const data = await documentClient.update(params).promise();
            responseBody = JSON.stringify(data);
            statusCode = 204;
        } catch (err) {
            responseBody = `Unable to update property: ${err}`;
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