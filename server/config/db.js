const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secondhand_marketplace';

  try {
    // Attempt standard connection with a short serverSelectionTimeoutMS so we don't stall if no local daemon
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Successfully connected to MongoDB at: ${uri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
  } catch (primaryErr) {
    console.warn(`[Database] Could not connect to configured MongoDB (${primaryErr.message}).`);
    console.log('[Database] Starting built-in embedded MongoMemoryServer for immediate zero-friction evaluation...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'secondhand_marketplace'
        }
      });
      const memoryUri = memoryServerInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to embedded MongoDB Memory Server at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to initialize embedded database:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    console.log('[Database] Disconnected successfully');
  } catch (err) {
    console.error('[Database] Error disconnecting:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
