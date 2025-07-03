// Test script to verify date validation fix
const fetch = require('node-fetch');

async function testDateValidation() {
  try {
    console.log('🧪 Testing date validation fix...');
    
    // Login first
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'mougrind',
        password: '@Asd.456@'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    
    console.log('✅ Login successful');
    
    // Test form creation without dates
    const formResponse = await fetch('http://localhost:3000/api/datos-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        numeroNota: 'TEST-DATE-FIX-002',
        propietario: 'Test User',
        direccionObra: 'Test Address',
        tipoObra: 'Construcción residencial',
        descripcionGeneral: 'Test description'
      })
    });
    
    const formData = await formResponse.json();
    
    if (formResponse.ok) {
      console.log('✅ SUCCESS: Form created without date validation errors!');
      console.log('Form ID:', formData.id);
      console.log('Numero Nota:', formData.numeroNota);
      console.log('Tipo Obra:', formData.tipoObra);
      console.log('Descripción General:', formData.descripcionGeneral);
    } else {
      console.log('❌ ERROR: Date validation still failing');
      console.log('Error:', formData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDateValidation();
