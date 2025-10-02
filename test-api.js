// Simple script to test the API directly
async function testAPI() {
  console.log('🔍 Testing API Connection...');
  
  const apiUrl = 'https://api.docuhub.me/api/v1/papers/published?page=0&size=5';
  
  try {
    console.log('📡 Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      }
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    console.log('📝 Papers Count:', data?.papers?.content?.length || 0);
    
    if (data?.papers?.content?.length > 0) {
      console.log('📋 First Paper:', data.papers.content[0]);
    }
    
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error Details:', error.message);
  }
}

// Run the test
testAPI();