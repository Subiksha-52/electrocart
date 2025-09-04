// Script to force server restart by killing and restarting
const { exec } = require('child_process');
const fs = require('fs');

console.log('🔄 Restarting server to clear cache...');

// Find and kill the node process running on port 5000
exec('npx kill-port 5000', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Error killing port:', error.message);
    return;
  }
  
  console.log('✅ Port 5000 cleared');
  
  // Wait a moment, then start the server
  setTimeout(() => {
    console.log('🚀 Starting server...');
    const serverProcess = exec('cd backend && npm start', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error starting server:', error.message);
        return;
      }
      console.log('✅ Server started successfully');
    });
    
    serverProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  }, 2000);
});
