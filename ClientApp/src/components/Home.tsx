import * as React from 'react';
import { connect } from 'react-redux';
import RandomQuote from "./RandomQuote";

import Yoda from '../assets/images/yoda.jpeg';

const Home = () => (
  <div>
    <h1>Yoda says</h1>
    <img src={Yoda} alt='Yoda Master' className="yoda" ></img>
    <p>To my project welcome.</p>
    <p>Yoda Of The Day it's a set of (not so) motivational quotes carefully curated by Master Yoda.</p>
    <p>A sample solution to quickly prepare a software developer in REST Services using .NET Core for the Backend and React + Redux on the Frontend.</p><p>The use of TDD, OOP and the SOLID Principles is required.</p>
    <p>Here's a random quote for today:</p>
    
    <RandomQuote></RandomQuote>
  </div>
);

export default connect()(Home);
