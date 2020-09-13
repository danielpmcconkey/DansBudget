import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
export default class LoaderSpinner extends React.Component {
   //other logic
   render() {
      return (
         <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={10000} //10 secs

         />
      );
   }
}