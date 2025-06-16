import React, { useContext } from 'react';
import AccountInfoForm from '../components/user/UserProfile'
import { UserContext } from '../contexts/UserContext'

// Test data
const bookings = [
  { country: "Vietnam", date: "2025-06-20", time: "10:00", guests: 2 },
  { country: "Japan", date: "2025-07-15", time: "14:00", guests: 3 }
];


const AccountInfoPage = () => {
  const { user, account } = useContext(UserContext);
  return (
    <div>
      <AccountInfoForm user={user} account={account} bookings={bookings} />
    </div>
  )
}

export default AccountInfoPage