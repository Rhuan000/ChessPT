export async function makeBARDRequest(data) {
    console.log('making request')
    const url = 'https://chess-pt.onrender.com/moveDetail';

  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        console.log(response)
        throw new Error(`HTTP error! Status: ${response.ok}`);
      }
  
      const responseData = await response.text();
      console.log('Server response:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error making BARD request:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  }