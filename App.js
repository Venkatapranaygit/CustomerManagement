import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5002/getRecords', {
          params: { page, sortBy, sortOrder, search }, // Ensure that the search parameter is correctly passed
        });
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [page, sortBy, sortOrder, search]);

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSortByDate = () => {
    handleSort('date');
  };

  const handleSortByTime = () => {
    handleSort('time');
  };

  return (
    <div>
      <div className="title">
        <h1>Customer Management</h1>
      </div>
      <div className="search-box">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Name or Location"
        />
      </div>
      <div className="sort-buttons">
        <button onClick={handleSortByDate}>Sort by Date</button>
        <button onClick={handleSortByTime}>Sort by Time</button>
      </div>
      <table id="customers">
        <thead>
          <tr>
            <th onClick={() => handleSort('customer_name')}>Customer Name</th>
            <th onClick={() => handleSort('age')}>Age</th>
            <th onClick={() => handleSort('phone')}>Phone</th>
            <th onClick={() => handleSort('location')}>Location</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th onClick={() => handleSort('time')}>Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.sno}>
              <td>{record.customer_name}</td>
              <td>{record.age}</td>
              <td>{record.phone}</td>
              <td>{record.location}</td>
              <td>{record.date}</td>
              <td>{record.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous Page
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next Page</button>
      </div>
    </div>
  );
};

export default App;