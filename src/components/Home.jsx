// src/components/BacterialCharacteristicsForm.js
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
  const [isLoading, setIsLoading] = useState(false); // Initially set to false
  const [characteristics, setCharacteristics] = useState(initialCharacteristicsState);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading to true when the request starts

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    // Do not stringify characteristics, append them directly
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

      // Check the server response and update state accordingly
      setSubmissionMessage(response.data.message);

      setCharacteristics(initialCharacteristicsState); // Clear form state
      setImage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false); // Set loading to false after the request completes (success or error)
    }
  };

  const handleCheckboxChange = (characteristic) => {
    setCharacteristics((prevCharacteristics) => ({
      ...prevCharacteristics,
      [characteristic]: !prevCharacteristics[characteristic],
    }));
  };

  const handleRefresh = () => {
    // Add logic to handle refreshing the page or resetting the form
    window.location.reload(); // This will refresh the page
  };


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    // Create a preview URL for the selected image
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
