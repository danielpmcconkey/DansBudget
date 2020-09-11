// import React from 'react';
// import axios from "axios";
// import Cookies from 'js-cookie';
// const config = require('../../config.json');


// export default function UpcomingTransactions(props) {

//     const token = props.auth.user.signInUserSession.idToken.jwtToken;

//     const upcomingTransactions = [];
//     const householdId = Cookies.get('householdid');
//     var rawResponse = "";

//     fetchUpcomingTransactions = async () => {
//         try {
//             console.log(`token: ${token}`);
//             var url = `${config.api.invokeUrlSimulation}/simulations`
//             var idToken = `Bearer ${token}`;
//             console.log(idToken);

//             const requestConfig = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "household-id": this.state.householdId
//                 },
//                 data: null
//             };

//             const res = await axios.get(url, requestConfig);
//             rawResponse = JSON.stringify(res);

//             //   this.setState({
//             //     bills: multiSort.multiSort(res.data, "nickName", true)
//             //   });

//         } catch (err) {
//             console.log(`An error has occurred: ${err}`);
//         }
//     }
//     // componentDidMount = () => {

//     //     fetchUpcomingTransactions();
//     // }


//     return (
//         <div className="table-container">
//             <p>response {rawResponse}</p>

//         </div>


//     )
// }
