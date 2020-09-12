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
    const assetAccountId = (event.pathParameters == undefined) ? undefined : event.pathParameters['asset-account-id'].toString();
    var { balance, householdId, isOpen, nickName, rate, isTaxAdvantaged } = JSON.parse(event.body);

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
                TableName: "assetAccount",
                Key: {
                    assetAccountId: assetAccountId
                },
                UpdateExpression: "set balance = :b, isOpen = :o, nickName = :n, rate = :r, isTaxAdvantaged = :t",
                ExpressionAttributeValues: {
                    ":b": balance,
                    ":o": isOpen,
                    ":n": nickName,
                    ":r": rate,
                    ":t": isTaxAdvantaged
                },
                ReturnValues: "UPDATED_OLD"
            };
            const data = await documentClient.update(params).promise();
            responseBody = JSON.stringify(data);
            statusCode = 204;
        } catch (err) {
            responseBody = `Unable to update asset accounts: ${err}`;
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