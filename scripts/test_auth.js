const axios = require('axios');

const API_URL = 'http://localhost:7000';
let cookie = '';

async function testAuth() {
    console.log('--- Starting Auth Tests ---');

    try {
        // 1. Register a Report Admin
        console.log('\n1. Registering Report Admin...');
        const regRes = await axios.post(`${API_URL}/api/auth/register-admin`, {
            name: 'Report Admin',
            email: 'report@example.com',
            mobile: '1234567890',
            password: 'password123',
            role: 'REPORT_ADMIN'
        });
        console.log('Register Success:', regRes.data.success);

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'report@example.com',
            password: 'password123'
        });
        cookie = loginRes.headers['set-cookie'][0];
        console.log('Login Success, Cookie received');

        // 3. Access Reports (Should be allowed)
        console.log('\n3. Accessing Reports (Authorized)...');
        const reportRes = await axios.get(`${API_URL}/feedback360/reports`, {
            headers: { Cookie: cookie }
        });
        console.log('Report Access Status:', reportRes.status);

        // 4. Access Schools (Should be forbidden)
        console.log('\n4. Accessing Schools (Unauthorized)...');
        try {
            await axios.get(`${API_URL}/feedback360/schools`, {
                headers: { Cookie: cookie }
            });
        } catch (err) {
            console.log('School Access Forbidden (Expected):', err.response.status, err.response.data.message);
        }

        // 5. Forgot Password
        console.log('\n5. Testing Forgot Password (OTP)...');
        const forgotRes = await axios.post(`${API_URL}/api/auth/forgot-password`, {
            mobile: '1234567890'
        });
        console.log('Forgot Password Success:', forgotRes.data.message);
        console.log('Check backend console for Mock OTP!');

    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
}

console.log('Please ensure the backend is running on port 7000 before running this test.');
testAuth();
