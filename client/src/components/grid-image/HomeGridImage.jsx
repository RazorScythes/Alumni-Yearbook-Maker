import React from 'react';
import Gallery from 'react-grid-gallery';

const HomeGrid = ({gallery}) => {
    return (
        <Gallery images={gallery ? gallery : []}/>
    )
}

export default HomeGrid
