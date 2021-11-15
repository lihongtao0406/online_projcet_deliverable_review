import React, { Component } from 'react';
import { Spin, Tooltip,Input } from 'antd';
import Icon, { LeftOutlined, RightOutlined, PlusCircleOutlined, MinusCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import styles from './pdfPreview.less';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class pdfPreview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageNumberInput: 1,
      pageNumberFocus: false,
      numPages: 1,
      pageWidth: 800,
    };
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages: numPages })
  }

  lastPage = () => {
    if (this.state.pageNumber == 1) {
      return
    }
    const page = this.state.pageNumber - 1
    this.setState({ pageNumber: page ,pageNumberInput:page})
  }
  nextPage = () => {
    if (this.state.pageNumber == this.state.numPages) {
      return
    }
    const page = this.state.pageNumber + 1
    this.setState({ pageNumber: page ,pageNumberInput:page})
  }
  onPageNumberFocus = e => {
    this.setState({ pageNumberFocus: true })
  };
  onPageNumberBlur = e => {
    this.setState({ pageNumberFocus: false ,pageNumberInput:this.state.pageNumber})
  };
  onPageNumberChange = e => {
    let value=e.target.value
    value=value<=0?1:value;
    value=value>=this.state.numPages?this.state.numPages:value;
    this.setState({ pageNumberInput: value })
  };
  toPage = e => {
    this.setState({ pageNumber: Number(e.target.value) })
  };

  pageZoomOut = () => {
    if (this.state.pageWidth <= 200) {
      return
    }
    const pageWidth = this.state.pageWidth * 0.8
    this.setState({ pageWidth: pageWidth })
  }
  pageZoomIn = () => {
    const pageWidth = this.state.pageWidth * 1.2
    this.setState({ pageWidth: pageWidth })
  }

  render() {
    const { pageNumber, pageNumberFocus, pageNumberInput,numPages, pageWidth } = this.state;
    return (
      <div className={styles.view}>
        <div className={styles.pageContainer}>
          <Document
            file={this.props.file}
            onLoadSuccess={this.onDocumentLoadSuccess}
            loading={<Spin size="large" />}
          >
            <Page pageNumber={pageNumber} width={pageWidth} loading={<Spin size="large" />} />
          </Document>
          <Tooltip>
            <LeftOutlined onClick={this.lastPage} />
          </Tooltip>
          <Input value={pageNumberFocus ? pageNumberInput : pageNumber}
            onFocus={this.onPageNumberFocus}
            onBlur={this.onPageNumberBlur}
            onChange={this.onPageNumberChange}
            onPressEnter={this.toPage} type="number" /> / {numPages}
          <Tooltip>
            <RightOutlined onClick={this.nextPage} />
          </Tooltip>
          <Tooltip>
            <PlusCircleOutlined onClick={this.pageZoomIn} />
          </Tooltip>
          <Tooltip >
            <MinusCircleOutlined onClick={this.pageZoomOut} />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default pdfPreview;
