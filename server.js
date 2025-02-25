const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const Booking = require('./models/Booking');
require('./db'); // Import the database connection

const app = express();
app.use(cors());

const schema = buildSchema(`
    type Booking {
        id: ID!
        name: String!
        email: String!
        destination: String!
        date: String!
    }

    type Query {
        bookings: [Booking]
    }

    type Mutation {
        createBooking(name: String!, email: String!, destination: String!, date: String!): Booking
        updateBooking(id: ID!, name: String!, email: String!, destination: String!, date: String!): Booking
        deleteBooking(id: ID!): Booking
    }
`);

const root = {
    bookings: async () => await Booking.find(),

    createBooking: async ({ name, email, destination, date }) => {
        const booking = new Booking({ name, email, destination, date });
        await booking.save();
        return booking;
    },

    updateBooking: async ({ id, name, email, destination, date }) => {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id, 
            { name, email, destination, date }, 
            { new: true }
        );
        if (!updatedBooking) {
            throw new Error('Booking not found');
        }
        return updatedBooking;
    },

    deleteBooking: async ({ id }) => {
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            throw new Error('Booking not found');
        }
        return deletedBooking;
    },
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}/graphql`);
});

