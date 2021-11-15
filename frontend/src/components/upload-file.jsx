import {
  Button,
  Typography
} from '@material-ui/core';
import React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import StatusDisplay from './status-display';


const UploadFile = function (props) {
  const proid = props.project_id;

  const [loadingStatus, setLoadingStatus] = React.useState('');

  const upload = function (f) {
    setLoadingStatus('loading');
    const file = new FormData();
    file.append('file', f);
    console.log(file);
    for (var value of file.values()) {
      console.log(value);
    }
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    axios.post('http://localhost:5000/proj/project/file/'+ proid, file, header)
      .then((response) => {
        console.log(response);
        if (response.status !== 201) {
          throw Error('Bad response.');
        } else {
          setLoadingStatus('done');
        }
      })
      .catch((error) => {
        console.log(error);
        setLoadingStatus('error');
      });
  }

  return (
    <div>
      <Typography variant="body1" display="inline">Upload File(pdf): </Typography>
      <input
        id='fileInput'
        type="file"
        accept="application/pdf"
        onChange={e => upload(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <label htmlFor='fileInput'>
        <Button
          color='secondary'
          component='div'   
        >
          Select file
        </Button>
      </label>
      <StatusDisplay status={loadingStatus}></StatusDisplay>
    </div>
  );
}

UploadFile.propTypes = {
  project_id: propTypes.any.isRequired,
}

export default UploadFile;
