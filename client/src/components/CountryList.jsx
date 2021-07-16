import React from 'react';
import * as boot from 'react-bootstrap';



var CountryList = ({country, handleClick}) => {

  return (
    <div className="country-list">

      <boot.ListGroupItem className="justify-content-between align-items-center">

        <div className="radio">
          <label>
            <input type="radio" value={country} onClick={(e) => handleClick(e)} name="select-country" />
            Country ---> {country}
          </label>
        </div>

      </boot.ListGroupItem>

    </div>
  );
};


// In the ES6 spec, files are "modules" and do not share a top-level scope.
// `var` declarations will only exist globally where explicitly defined.
export default CountryList;



