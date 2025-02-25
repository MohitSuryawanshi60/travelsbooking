// import React from 'react';
// import { useQuery, gql } from '@apollo/client';

// const GET_BOOKINGS = gql`
//     query GetBookings {
//         bookings {
//             id
//             name
//             email
//             destination
//             date
//         }
//     }
// `;

// const BookingList = () => {
//     const { loading, error, data } = useQuery(GET_BOOKINGS);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error.message}</p>;

//     return (
//         <div className="booking-list">
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Destination</th>
//                         <th>Date</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.bookings.map((booking) => (
//                         <tr key={booking.id}>
//                             <td>{booking.name}</td>
//                             <td>{booking.email}</td>
//                             <td>{booking.destination}</td>
//                             <td>{new Date(booking.date).toLocaleDateString()}</td> 
//                         </tr>
//                         // toLocaleDateString()
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default BookingList;


import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL query to get all bookings
const GET_BOOKINGS = gql`
    query GetBookings {
        bookings {
            id
            name
            email
            destination
            date
        }
    }
`;

// GraphQL mutation to update a booking
const UPDATE_BOOKING = gql`
    mutation UpdateBooking($id: ID!, $name: String!, $email: String!, $destination: String!, $date: String!) {
        updateBooking(id: $id, name: $name, email: $email, destination: $destination, date: $date) {
            id
            name
            email
            destination
            date
        }
    }
`;

// GraphQL mutation to delete a booking
const DELETE_BOOKING = gql`
    mutation DeleteBooking($id: ID!) {
        deleteBooking(id: $id) {
            id
        }
    }
`;

const BookingList = () => {
    const { loading, error, data } = useQuery(GET_BOOKINGS);
    const [updateBooking] = useMutation(UPDATE_BOOKING);
    const [deleteBooking] = useMutation(DELETE_BOOKING);
    const [editingBooking, setEditingBooking] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', destination: '', date: '' });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleEdit = (booking) => {
        setEditingBooking(booking.id);
        setFormData({
            name: booking.name,
            email: booking.email,
            destination: booking.destination,
            date: booking.date,
        });
    };

    const handleDelete = (id) => {
        deleteBooking({
            variables: { id },
            refetchQueries: [{ query: GET_BOOKINGS }],
        }).then(() => {
            console.log("Booking deleted successfully");
        }).catch(err => {
            console.error("Error deleting booking:", err);
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        updateBooking({
            variables: { id: editingBooking, ...formData },
            refetchQueries: [{ query: GET_BOOKINGS }],
        }).then(() => {
            console.log("Booking updated successfully");
        }).catch(err => {
            console.error("Error updating booking:", err);
        });
        setEditingBooking(null);
        setFormData({ name: '', email: '', destination: '', date: '' });
    };

    return (
        <div className="booking-list">
            <h2>Booking List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>
                                {editingBooking === booking.id ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    booking.name
                                )}
                            </td>
                            <td>
                                {editingBooking === booking.id ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    booking.email
                                )}
                            </td>
                            <td>
                                {editingBooking === booking.id ? (
                                    <input
                                        type="text"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                ) : (
                                    booking.destination
                                )}
                            </td>
                            <td>
                                {editingBooking === booking.id ? (
                                    <input
                                        type="date"
                                        value={formData.date.split('T')[0]} // Format date for input
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                ) : (
                                    new Date(booking.date).toLocaleDateString()
                                )}
                            </td>
                            <td>
                                {editingBooking === booking.id ? (
                                    <>
                                        <button onClick={handleUpdate}>Update</button>
                                        <button onClick={() => setEditingBooking(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(booking)}>Edit</button>
                                        <button onClick={() => handleDelete(booking.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingList;

