// src/components/BacterialCharacteristicsForm.js
import React, { useState } from 'react';
import axios from "axios";
import './home.css';

const BacterialCharacteristicsForm = () => {
  const initialCharacteristicsState = {
    gramNegativeBacilli: false,
    oxidasePositive: false,
    catalasePositive: false,
    nonLactoseFermenting: false,
    colistinResistant: false,
  };
  const [characteristics, setCharacteristics] = useState(initialCharacteristicsState);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

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
      if (response.data.success) {
        setSubmissionMessage('Success: All characteristics are true');
      } else {
        setSubmissionMessage('Probability in zero: At least one characteristic is false');
      }

      setCharacteristics(initialCharacteristicsState); // Clear form state
      setImage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
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
  };

  return (
    <div className="form-container">
       <div className="refresh-button">
        <button onClick={handleRefresh}>Refresh</button>
      </div>
      <h1>Bacterial Characteristics Form</h1>
      {submissionMessage && <p className="submission-message">{submissionMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="checkbox-group">
          <label>
            Gram Negative Bacilli:
            <input
              type="checkbox"
              checked={characteristics.gramNegativeBacilli}
              onChange={() => handleCheckboxChange('gramNegativeBacilli')}
            />
          </label>
        </div>
        <div className="checkbox-group">
          <label>
          oxidase Positive:
            <input
              type="checkbox"
              checked={characteristics.oxidasePositive}
              onChange={() => handleCheckboxChange('oxidasePositive')}
            />
          </label>
        </div>
        <div className="checkbox-group">
          <label>
          catalase Positive:
            <input
              type="checkbox"
              checked={characteristics.catalasePositive}
              onChange={() => handleCheckboxChange('catalasePositive')}
            />
          </label>
        </div>
        <div className="checkbox-group">
          <label>
          nonLactose Fermenting:
            <input
              type="checkbox"
              checked={characteristics.nonLactoseFermenting}
              onChange={() => handleCheckboxChange('nonLactoseFermenting')}
            />
          </label>
        </div>

        <div className="checkbox-group">
          <label>
          colistin Resistant:
            <input
              type="checkbox"
              checked={characteristics.colistinResistant}
              onChange={() => handleCheckboxChange(' colistinResistant')}
            />
          </label>
        </div>
       
        <div className="image-upload">
          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Image Preview" className="image-preview" />
          )}
        </div>
        <button type="submit" className="submit-button">Submit</button>
        
      </form>
    </div>
  );
};

export default BacterialCharacteristicsForm;
