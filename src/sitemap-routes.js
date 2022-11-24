import React from 'react';
import { Route } from 'react-router';
 
export default (
    <Route>
	  <Route path="/" exact>
          
        </Route>
        <Route path="/about-us"  exact />
        <Route path="/cancellation-policy"  exact />
        <Route path="/complaints-suggestions"  exact />
        <Route path="/terms-and-conditions"  exact />
        <Route path="/privacy-policy" exact />

        <Route path="/villas/:destination"  exact />
        <Route path="/villas/mapview/:destination" exact />
          
        <Route path="/villas/:single/:vname"exact />

        <Route path="/user/register/dashboard" exact>
        </Route>
        <Route path="/user/login/dashboard" exact>
        </Route>
        <Route path="/blogs" exact>
        </Route>
        <Route path="/get-quotation" exact>
        </Route>
        <Route path="/user/myprofile/dashboard" exact>
        </Route>
        <Route path="/user/logout/dashboard" exact>
        </Route>
      
    </Route>
);