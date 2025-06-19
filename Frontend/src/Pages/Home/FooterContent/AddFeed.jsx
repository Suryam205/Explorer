import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../ConfigApi/Api';
import HomeFooter from '../HomeFooter';

const AddFeed = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);
    formData.append('description', description || "");  // Optional: other data

    try {
      const response = await axios.post(`${API_URL}/addFeed`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',    
        },
         withCredentials: true,
      });

      if(response.data.success){
       
        alert('File uploaded successfully!');
        setDescription('');
        setFile('');
      }else{
        console.log("Error while uploading")
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed.');
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label >Place your Image here</label><br/>
          <input
            type="file"
            className="form-control"
            id="media"
            name="media"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label >Body</label>
          <textarea
            className="form-control"
            id="body"
            name="body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>

      <HomeFooter/>
    </div>
  );
};

export default AddFeed;
