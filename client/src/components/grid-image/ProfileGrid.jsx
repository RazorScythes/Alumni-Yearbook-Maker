import React from 'react'
import Gallery from 'react-grid-gallery';

const ProfileGrid = props => {
    return (
        <Gallery 
           rowHeight={props.rowHeight}
           images={props.image}
        />
    )
}

export default ProfileGrid
