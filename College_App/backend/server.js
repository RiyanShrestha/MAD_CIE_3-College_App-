const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Auth Logic for DEMO (In real apps, use bcrypt and tokens)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM User WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            res.json({ 
                success: true, 
                user: { id: user.user_id, name: user.name, email: user.email, role: user.role } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Rooms Logic
app.get('/api/rooms', async (req, res) => {
    try {
        const [rooms] = await db.execute('SELECT * FROM Room');
        res.json({ success: true, rooms });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Bookings Logic
app.post('/api/bookings', async (req, res) => {
    const { booking_date, time_slot, user_id, room_id } = req.body;
    try {
        // Prevent double booking
        const [existing] = await db.execute(
            'SELECT * FROM Booking WHERE room_id = ? AND booking_date = ? AND time_slot = ? AND status = "Confirmed"',
            [room_id, booking_date, time_slot]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Room already booked for this slot' });
        }

        // Insert booking
        await db.execute(
            'INSERT INTO Booking (booking_date, time_slot, user_id, room_id, status) VALUES (?, ?, ?, ?, "Confirmed")',
            [booking_date, time_slot, user_id, room_id]
        );

        // Update room status if necessary (Demo logic: Just mark as Booked if it was Available)
        // (In a real system, you'd manage availability more dynamically)
        await db.execute('UPDATE Room SET status = "Booked" WHERE room_id = ?', [room_id]);

        res.json({ success: true, message: 'Booking successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
