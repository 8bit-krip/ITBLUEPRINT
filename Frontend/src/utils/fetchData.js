import axios from "axios";

export const fetchSheetData = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_SHEET_API);
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch sheet data", err);
    return [];
  }
};