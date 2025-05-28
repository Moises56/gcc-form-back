// Test script to verify complete image deletion functionality
const fs = require('fs');
const path = require('path');

async function testImageDeletion() {
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    console.log('🧪 Testing complete image deletion functionality...\n');
    
    // Use a simplified approach to test deletion of existing images
    // Step 1: Login to get auth token
    console.log('1. Logging in...');
    
    const fetch = (await import('node-fetch')).default;
    
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }
    
    const { access_token } = await loginResponse.json();
    const authHeaders = {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('✅ Login successful\n');
    
    // Step 2: Get a form to work with
    console.log('2. Getting available forms...');
    const formsResponse = await fetch(`${baseUrl}/datos-form`, {
      headers: authHeaders
    });
    
    const forms = await formsResponse.json();
    if (!forms.data || forms.data.length === 0) {
      throw new Error('No forms available for testing');
    }
    
    const testFormId = forms.data[0].id;
    console.log(`✅ Using form ID: ${testFormId}\n`);
    
    // Step 3: Create a test image file
    console.log('3. Creating test image file...');
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageData.split(',')[1], 'base64');
    const testImagePath = path.join(__dirname, 'uploads', 'test-image.png');
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Test image file created\n');
    
    // Step 4: Upload the image to a form
    console.log('4. Uploading image to form...');
    const formData = new FormData();
    const imageBlob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', imageBlob, 'test-image.png');
    formData.append('descripcion', 'Test image for deletion');
    
    const uploadResponse = await fetch(`${baseUrl}/uploads/single/${testFormId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${access_token}` },
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${errorText}`);
    }
    
    const uploadResult = await uploadResponse.json();
    const imageId = uploadResult.id;
    const uploadedFilename = uploadResult.url.split('/').pop();
    
    console.log(`✅ Image uploaded successfully`);
    console.log(`   Image ID: ${imageId}`);
    console.log(`   Filename: ${uploadedFilename}\n`);
    
    // Step 5: Verify the file exists in uploads folder
    const uploadedFilePath = path.join(__dirname, 'uploads', uploadedFilename);
    if (!fs.existsSync(uploadedFilePath)) {
      throw new Error('Uploaded file not found in uploads folder');
    }
    console.log('✅ Physical file exists in uploads folder\n');
    
    // Step 6: Delete the image
    console.log('5. Deleting the image...');
    const deleteResponse = await fetch(`${baseUrl}/datos-form/imagenes/${imageId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    
    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      throw new Error(`Delete failed: ${errorText}`);
    }
    
    const deleteResult = await deleteResponse.json();
    console.log(`✅ Delete API response: ${deleteResult.message}\n`);
    
    // Step 7: Verify the file was deleted from uploads folder
    console.log('6. Verifying physical file deletion...');
    if (fs.existsSync(uploadedFilePath)) {
      console.log('❌ Physical file still exists in uploads folder!');
      return false;
    }
    console.log('✅ Physical file successfully deleted from uploads folder\n');
    
    // Step 8: Verify the database record was deleted
    console.log('7. Verifying database record deletion...');
    const verifyResponse = await fetch(`${baseUrl}/datos-form/imagenes/${testFormId}`, {
      headers: authHeaders
    });
    
    const remainingImages = await verifyResponse.json();
    const imageStillExists = remainingImages.some(img => img.id === imageId);
    
    if (imageStillExists) {
      console.log('❌ Database record still exists!');
      return false;
    }
    console.log('✅ Database record successfully deleted\n');
    
    // Cleanup
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    console.log('🎉 All tests passed! Complete image deletion is working correctly.');
    console.log('✅ Both database record and physical file were successfully deleted.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testImageDeletion().then(success => {
  process.exit(success ? 0 : 1);
});
