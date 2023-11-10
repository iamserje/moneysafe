const API_URL = 'https://showy-sugared-aquarius.glitch.me/api';

// --------Get Data fron server---------------
export const getData = async (url) => {
   try {
      const response = await fetch(`${API_URL}${url}`);
      if (!response.ok) {
         throw new Error(`HTTP Error, ${response.status}`);
      }
      return await response.json();
   } catch (error) {
      console.error("Error getting data", error);
      throw error;
   }
};

export const postData = async (url, data) => {
   try {
      const response = await fetch(`${API_URL}${url}`, {
         method: 'POST',
         headers: {
            "Content-Type": 'application/json'
         },
         body: JSON.stringify(data)
      });
      if (!response.ok) {
         throw new Error(`HTTP Error, ${response.status}`);
      }
      return await response.json();
   } catch (error) {
      console.error("Error sending data", error);
      throw error;
   }
};

export const delData = async (url) => {
   try {
      const response = await fetch(`${API_URL}${url}`, {
         method: 'DELETE',
      });
      if (!response.ok) {
         throw new Error(`HTTP Error, ${response.status}`);
      }
      return response.json();
   } catch (error) {
      console.error("Error deleting data", error);
      throw error;
   }
};

