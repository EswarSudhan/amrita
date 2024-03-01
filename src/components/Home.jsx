
import React, { useState } from 'react';
import axios from "axios";
import { Hourglass } from 'react-loader-spinner';
import './home.css';

const BacterialCharacteristicsForm = () => {
  const initialCharacteristicsState = {
    gramNegativeBacilli: false,
    oxidasePositive: false,
    catalasePositive: false,
    nonLactoseFermenting: false,
    colistinResistant: false,
  };
  const [isLoading, setIsLoading] = useState(false); 
  const [characteristics, setCharacteristics] = useState(initialCharacteristicsState);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); 

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    
    formData.append('gramNegativeBacilli', characteristics.gramNegativeBacilli);
    formData.append('oxidasePositive', characteristics.oxidasePositive);
    formData.append('catalasePositive', characteristics.catalasePositive);
    formData.append('nonLactoseFermenting', characteristics.nonLactoseFermenting);
    formData.append('colistinResistant', characteristics.colistinResistant);

    try {
      const response = await axios.post('http://localhost:5000/api/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      
      setSubmissionMessage(response.data.message);

      setCharacteristics(initialCharacteristicsState); 
      setImage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleCheckboxChange = (characteristic) => {
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      [characteristic]: !prevCharacteristics[characteristic],
    }));
  };

  const handleRefresh = () => {
    
    window.location.reload(); 
  };


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    
    setImagePreview(URL.createObjectURL(selectedImage));
    setSubmissionMessage("");
  };

  const imgUrl = process.env.PUBLIC_URL + '/bg_1.jpeg';
  const imgUrl1 = process.env.PUBLIC_URL + '/logo.png';

  return (
    <div>

      <img className="background_image" src={imgUrl} alt="Background" />
      <img className="top-left-image" src={imgUrl1} alt="Background" />
    <div className="form-container">
    
      
      <h1>Bacteria Classifier</h1>
      {submissionMessage && <p className="submission-message">{submissionMessage}</p>}
      <form onSubmit={handleSubmit}>
      <div className='load'>
      {isLoading && (
         <Hourglass/>
      )}
      </div>
       
        <div className="image-upload">
          <label>
            Upload Image :
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              
              
            />
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Image Preview" className="image-upload" />
          )}
        </div>
        <div className="refresh-button">
        <button type="submit" className="submit-button">Submit</button>
        
        <button onClick={handleRefresh} className="submit-button">Refresh</button>
      </div>
        
      </form>
    </div>
    </div>
  );
};

export default BacterialCharacteristicsForm;
