import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { makeStyles } from '@material-ui/core/styles';
const BASE_URL = 'http://127.0.0.1:5000';
const useStyles = makeStyles((theme) => ({
  frame: {
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width: '80vw',
    maxWidth: '800px',
    margin:'0 auto',
    height:'500px',
    overflow:'auto',
    background:'white',
    border:'1px solid #ccc',
    background:'black',
    color:'white'
  },
  div1:{
    height:'500px',
  }
}));
export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null);
  const classes = useStyles();
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const { pdf } = props;

  return (
    <div className={classes.frame}>
    <div className={classes.div1}>
      <Document
        file={pdf}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>  
    </div>
  );
}
