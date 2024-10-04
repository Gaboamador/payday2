import { supabase } from '../supabaseClient';

// const uploadJsonData = async (data, fileName) => {
//   const bucketName = 'my-bucket'; // Replace with your bucket name

//   // Convert the data to a JSON string
//   const jsonData = JSON.stringify(data);

//   // Upload the JSON string as a file
//   const { error } = await supabase
//     .storage
//     .from(bucketName)
//     .upload(fileName, new Blob([jsonData], { type: 'application/json' }), {
//       cacheControl: '3600',
//       upsert: true,
//     });

//   if (error) {
//     console.error('Error uploading JSON data:', error.message);
//     return;
//   }

//   console.log('JSON data uploaded successfully');
// };