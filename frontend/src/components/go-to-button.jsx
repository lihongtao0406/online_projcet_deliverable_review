import { Button } from '@material-ui/core';
import React from 'react';
import propTypes from 'prop-types';
import { Redirect } from 'react-router';
// import { StoreContext } from '../utils/store';

const GoToButton = function (props) {
  const [go, setGo] = React.useState(false);
  // const context = React.useContext(StoreContext);

  const handle = () => {
    setGo(true);
  }

  return (
    <>
      {go &&
        <Redirect to = {`${props.to}`} />
      }
      {!go &&
        <Button
          variant={props.variant}
          onClick={handle}
        >
          {props.children}
        </Button>
      }
    </>
  );
}

GoToButton.propTypes = {
  to: propTypes.any.isRequired,
  variant: propTypes.any.isRequired,
  children: propTypes.any.isRequired,
}

export default GoToButton;
