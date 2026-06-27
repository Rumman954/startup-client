import api from './api';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const uploadImageFile = async (file) => {
  if (!file) return '';
  const image = await fileToBase64(file);
  const { data } = await api.post('/api/upload/image', { image });
  return data.url;
};
