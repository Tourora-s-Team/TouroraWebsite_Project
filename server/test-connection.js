require('dotenv').config();
const connectDB = require('./src/config/db');

const testConnection = async () => {
    try {
        // Thử kết nối đến database
        const conn = await connectDB();

        if (conn) {
            console.log('Test connection successful!');
            console.log('Database name:', conn.connection.name);
            console.log('Connection state:', conn.connection.readyState);

            // Hiển thị danh sách collections
            const collections = await conn.connection.db.listCollections().toArray();
            console.log('\nAvailable collections:');
            collections.forEach(collection => {
                console.log(`- ${collection.name}`);
            });
        }

        // Đóng kết nối sau 5 giây
        setTimeout(async () => {
            await conn.connection.close();
            console.log('\nConnection closed successfully');
            process.exit(0);
        }, 5000);

    } catch (error) {
        console.error('Test connection failed:', error.message);
        process.exit(1);
    }
};

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/(.[^:]+):(.[^@]+)@/, 'mongodb+srv://[username]:[password]@'));
testConnection();
