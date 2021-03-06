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
    const billId = (event.pathParameters == undefined) ? undefined : event.pathParameters['bill-id'].toString();
    var { householdId, isOpen, nickName, amountDue, lastPaidDate, payFrequency } = JSON.parse(event.body);

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
                TableName: "bill",
                Key: {
                    billId: billId
                },
                UpdateExpression: "set isOpen = :o, nickName = :n, amountDue = :amountDue, lastPaidDate = :lastPaidDate, payFrequency = :payFrequency",
                ExpressionAttributeValues: {
                    ":o": isOpen,
                    ":n": nickName,
                    ":amountDue": amountDue,
                    ":lastPaidDate": lastPaidDate,
                    ":payFrequency": payFrequency
                },
                ReturnValues: "UPDATED_OLD"
            };

            const data = await documentClient.update(params).promise();
            responseBody = JSON.stringify(data);
            statusCode = 204;
        } catch (err) {
            responseBody = `Unable to update bill: ${err}`;
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