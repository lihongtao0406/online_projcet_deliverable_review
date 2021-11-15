import React from 'react';
import {
  Typography
} from '@material-ui/core';
import propTypes from 'prop-types';

const StatusDisplay = (props) => {
  const loading = props.status
  return (
    <div style={{ display: 'inline' }}>
      <Typography
        style={loading === 'done' ? { display: 'inline' } : { display: 'none' }}
        variant="body1"
      >
        ✅ Done!
      </Typography>
      <Typography
        style={loading === 'error' ? { display: 'inline' } : { display: 'none' }}
        variant="body1"
      >
        ❌ Something wrong...Retry
      </Typography>
    </div>
  );
}

StatusDisplay.propTypes = {
  status: propTypes.any.isRequired,
}

export default StatusDisplay;
