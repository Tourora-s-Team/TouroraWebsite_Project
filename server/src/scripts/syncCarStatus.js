const mongoose = require('mongoose');
const { syncAllCarStatuses } = require('../utils/carStatusSync');
require('dotenv').config();

/**
 * Script để đồng bộ car status với car rental status
 * Có thể chạy thủ công hoặc theo lịch trình
 */
const runCarStatusSync = async () => {
  try {
    console.log('🚀 Starting car status synchronization script...');
    
    // Kết nối database nếu chưa kết nối
    if (mongoose.connection.readyState === 0) {
      console.log('📡 Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    }

    // Chạy đồng bộ
    const result = await syncAllCarStatuses();
    
    console.log('✅ Car status synchronization completed successfully!');
    console.log(`📊 Synchronized ${result.synchronized} cars`);
    
    return result;
  } catch (error) {
    console.error('❌ Error during car status synchronization:', error);
    throw error;
  }
};

/**
 * Chạy đồng bộ định kỳ mỗi X phút
 * @param {number} intervalMinutes - Số phút giữa các lần đồng bộ
 */
const startPeriodicSync = (intervalMinutes = 30) => {
  console.log(`⏰ Starting periodic car status sync every ${intervalMinutes} minutes`);
  
  // Chạy ngay lập tức
  runCarStatusSync().catch(console.error);
  
  // Thiết lập interval
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(() => {
    console.log('🔄 Running scheduled car status sync...');
    runCarStatusSync().catch(console.error);
  }, intervalMs);
};

/**
 * Cleanup khi script kết thúc
 */
const cleanup = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('📡 Database connection closed');
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// Xử lý signals để cleanup gracefully
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, cleaning up...');
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, cleaning up...');
  await cleanup();
  process.exit(0);
});

module.exports = {
  runCarStatusSync,
  startPeriodicSync,
  cleanup
};

// Nếu script được chạy trực tiếp
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--periodic')) {
    const intervalIndex = args.indexOf('--interval');
    const interval = intervalIndex !== -1 && args[intervalIndex + 1] 
      ? parseInt(args[intervalIndex + 1]) 
      : 30;
    
    startPeriodicSync(interval);
  } else {
    // Chạy một lần rồi thoát
    runCarStatusSync()
      .then((result) => {
        console.log('✅ Script completed successfully');
        return cleanup();
      })
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Script failed:', error);
        cleanup().then(() => process.exit(1));
      });
  }
}
