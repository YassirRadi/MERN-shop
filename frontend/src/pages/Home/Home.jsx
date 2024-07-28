import React from 'react';

import Header from '../../components/Header/Header';
import Popular from '../../components/Popular/Popular';
import Offers from '../../components/offers/Offers';
import Latest from '../../components/Latest/Latest';

const Home = () => {
  return (
    <div>
        <Header/>
        <Popular/>
        <Offers/>
        <Latest/>
        
      
    </div>
  )
}

export default Home
