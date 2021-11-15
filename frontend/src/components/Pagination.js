import React, { useState, useContext, useEffect } from 'react';
import { MemoryRouter, Route } from 'react-router';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { StoreContext } from '../utils/store';

export default function PaginationLink(props) {
    const context = useContext(StoreContext);
    const [DbPage, setDbPage] = context.DbPage;
    const [MpPage, setMpPage] = context.MpPage;
    return (
    // <MemoryRouter initialEntries={['/inbox']} initialIndex={0} >
    <>
      <Route>
        {({ location }) => {
          const query = new URLSearchParams(location.search);
          const page = parseInt(query.get('page') || '1', 10);
          if(props.route === '/Dashboard'){
              setDbPage(page);
          }
          if(props.route === '/myproject'){
              setMpPage(page);
          }
          return (
            <Pagination
              page={page}
              count={props.maxpage}
              variant="outlined"
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`${props.route}${item.page === 1 ? '' : `?page=${item.page}`}`}
                  {...item}
                />
              )}
            />
          );
        }}
      </Route>
    </>
    // </MemoryRouter>
  );
}