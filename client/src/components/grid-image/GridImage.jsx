import React from "react";
import Gallery from "react-grid-gallery";
import no_image from '../../images/no_preview.jpg'
const GridImage = props => {
    let data = props.data
    let images = []
  
    let struct = (image, val, val2, cap) => {
        return {
            src: image,
            srcWidth: 350,
            thumbnail:
                image,
            thumbnailWidth: 320,
            thumbnailHeight: 174,
                tags: [
                { value: val, title: "Main" },
                { value: val2, title: "Main" }
            ],
            caption: cap
        }
    }

    if(!data.multipage){
        if(data.template_id.template1 !== null) images.push(struct(data.template_id.template1.image, "Template", "Main", "Template Main"))
        else images.push(struct(no_image, "Template", "Main", "Template Main"))
    }
    else{
        if(data.template_id !== null){
            if(data.template_id.template1 !== null) images.push(struct(data.template_id.template1.image, "Template", "Front Page", "Template Front Page"))
            else images.push(struct(no_image, "Template", "Front Page", "Template Front Page"))
            if(data.template_id.template2 !== null) images.push(struct(data.template_id.template2.image, "Template", "Commence", "Template Commence"))
            else images.push(struct(no_image, "Template", "Commence", "Template Commence"))
            if(data.template_id.template3 !== null) images.push(struct(data.template_id.template3.image, "Template", "Events", "Template Events"))
            else images.push(struct(no_image, "Template", "Events", "Template Events"))
            if(data.template_id.template4 !== null) images.push(struct(data.template_id.template4.image, "Template", "Institutes", "Template Institutes"))
            else images.push(struct(no_image, "Template", "Institutes", "Template Institutes"))
        }else{
            images.push(struct(no_image, "Template", "Front Page", "Template Front Page"))
            images.push(struct(no_image, "Template", "Speech Commence", "Template Commence"))
            images.push(struct(no_image, "Template", "Events", "Template Events"))
            images.push(struct(no_image, "Template", "Institutes", "Template Institutes"))
        }
    }

    // if(data.banner_id !== undefined) images.push(struct(data.banner_id.image, "Banner", "Alumni", "Banner"))
    // else images.push(struct(no_image, "Banner", "Alumni", "Banner"))

    // if(data.frame_id !== undefined) images.push(struct(data.frame_id.image, "Frame", "Alumni", "Frame"))
    // else images.push(struct(no_image, "Frame", "Alumni", "Frame"))
    
    if(data.cover_id) images.push(struct(data.cover_id.image, "Cover Page", "Yearbook", "Cover Page"))
    else images.push(struct(no_image, "Cover Page", "Yearbook", "Cover Page"))

    if(data.nametags_id !== null) images.push(struct(data.nametags_id.image, "Nametag", "Design", "Nametag Design"))
    else images.push(struct(no_image, "Nametag", "Design", "Nametag Design"))

    return (
        <Gallery
            images={images}

            maxRows={4}
        />
    )
}

export default GridImage
