import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookingForm from './BookingForm';
import BookingList from './BookingList';
import './App.css'; // Import CSS for animations

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="app">
                    <h1>Travel Booking System</h1>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/bookings">Bookings</Link>
                    </nav>
                    <Routes>
                        <Route path="/" element={<BookingForm />} />
                        <Route path="/bookings" element={<BookingList />} />
                    </Routes>
                </div>
            </Router>
        </ApolloProvider>
    );
};

export default App;