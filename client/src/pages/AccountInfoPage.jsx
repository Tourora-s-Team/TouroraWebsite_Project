import React from 'react';
import AccountInfoForm from '../components/user/AccountInfoForm'

// test data
const user = {
  fullname: "Nguyen Van A",
  email: "vana@example.com",
  dateOfBirth: "1998-05-12",
  phone: "0123456789",
  username: "nguyenvana"
};

const bookings = [
  { country: "Vietnam", date: "2025-06-20", time: "10:00", guests: 2 },
  { country: "Japan", date: "2025-07-15", time: "14:00", guests: 3 }
];


const AccountInfoPage = () => {
    return (
        <div>
            <AccountInfoForm user={user} bookings={bookings}/>
        </div>
    )
}

export default AccountInfoPage