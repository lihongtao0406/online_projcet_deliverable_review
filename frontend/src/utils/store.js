import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = React.createContext(null);

// How to use?
// 1. import { StoreContext } from '../utils/store';
// 2. const context = React.useContext(StoreContext);
// 3. const var = context.xxx;

const StoreProvider = ({ children }) => {
  const BASE_URL = 'http://localhost:5000';
  const LOCAL_URL = 'http://localhost:3000';
  const [token, setToken] = React.useState('');
  const [DbPage, setDbPage] = useState(1);
  const [MpPage, setMpPage] = useState(1);
  const [UserId, setUserId] = useState();
  // define yyy
  const [DbCards, setDbCards] = useState([]);
  const [MpCards, setMpCards] = useState([]);
  const [UserName,setUserName] = useState();
  const fields = [
    "Agriculture",
    "Animal Sciences",
    "Food Sciences & Technology",
    "Architecture",
    "Women’s Studies",
    "Art",
    "Accounting",
    "Finance",
    "Public Relations",
    "Computer Science",
    "Civil Engineering",
    "Mechanical Engineering",
  ]
  const [cards, setCards] = useState([
    {
    title: 'a long long long long long long long long long long long title',
    author: 'author',
    summary: 'summary',
    rate: 4,
    },
    {
    title: 'title',
    author: 'author',
    summary: 'summary',
    rate: 3,
    },
    {
    title: 'title',
    author: 'author',
    summary: 'summary',
    rate: 2,
    },
    {
    title: 'title',
    author: 'author',
    summary: 'summary',
    rate: 1,
    },
    {
    title: 'title',
    author: 'author',
    summary: 'summary',
    rate: 5,
    },
  ]);
  
  const store = {
    local: LOCAL_URL,
    url: BASE_URL,
    token: [token, setToken],
    cards: [cards, setCards],
    DbPage: [DbPage, setDbPage],
    MpPage: [MpPage, setMpPage],
    UserId: [UserId, setUserId],
    DbCards: [DbCards, setDbCards],
    MpCards: [MpCards, setMpCards],
    UserName: [UserName, setUserName],
    fields: fields,
    // xxx: yyy
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

StoreProvider.propTypes = {
  children: PropTypes.any,
};

export default StoreProvider;
