import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_BOOKING = gql`
    mutation CreateBooking($name: String!, $email: String!, $destination: String!, $date: String!) {
        createBooking(name: $name, email: $email, destination: $destination, date: $date) {
            id
            name
            email
            destination
            date
        }
    }
`;

const BookingForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');

    const [createBooking] = useMutation(CREATE_BOOKING);

    const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert date to ISO string format
    const formattedDate = new Date(date).toISOString();
    await createBooking({ variables: { name, email, destination, date: formattedDate } });
    setName('');
    setEmail('');
    setDestination('');
    setDate('');
};

    return (
        <form onSubmit={handleSubmit} className="booking-form">
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required

            />
            <button type="submit">Book Now</button>
        </form>
    );
};

export default BookingForm;