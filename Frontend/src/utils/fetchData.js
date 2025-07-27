import axios from "axios";

export const fetchSheetData = async () => {
  const SHEET_ID = import.meta.env.VITE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const SHEET_NAME = "Sheet1";

  if (!SHEET_ID || !API_KEY) {
    console.error("Missing SHEET_ID or API_KEY in environment variables.");
    return {};
  }

  const rgbToColorName = (rgbColor) => {
    if (!rgbColor) return "Gray";
    const { red = 0, green = 0, blue = 0 } = rgbColor;
    if (red > 0.8 && green < 0.2 && blue < 0.2) return "Red";
    if (green > 0.5 && red < 0.5) return "Green";
    return "Gray";
  };

  const parseSheetData = (gridData) => {
    const sheet = gridData.sheets.find(s => s.properties.title === SHEET_NAME);
    if (!sheet || !sheet.data || !sheet.data[0].rowData) return { [SHEET_NAME]: {} };

    const rows = sheet.data[0].rowData;
    const headers = rows[0].values.map(cell => cell.formattedValue);
    const data = {};
    let currentServiceKey = null;

    const headerMap = {};
    headers.forEach((header, index) => {
      if (header) headerMap[header.trim()] = index;
    });

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].values || [];
      const getCellData = (headerName) => {
        const index = headerMap[headerName];
        if (index === undefined || !rowData[index]) return { value: "", color: "Gray" };
        const cell = rowData[index];
        return {
          value: cell.formattedValue || "",
          color: rgbToColorName(cell.effectiveFormat?.backgroundColor),
        };
      };

      const serviceName = getCellData("Service").value;
      const subheadingName = getCellData("Subheading").value;

      if (serviceName && serviceName.trim() !== "") {
        currentServiceKey = serviceName.trim();
        data[currentServiceKey] = {
          Subheading: {},
          Compliant: Number(getCellData("Compliant").value) || null,
          Total: getCellData("Total").value,
          Mising: getCellData("Mising").value,
          "%Compliant": getCellData("% Compliant").value,
        };

        const statusC = getCellData("Status C");
        if (statusC.value) {
          data[currentServiceKey].status_C = {
            name: statusC.value,
            colour: statusC.color,
          };
        }

        const statusE = getCellData("Status E");
        if (statusE.value) {
          data[currentServiceKey].status_E = {
            name: statusE.value,
            colour: statusE.color,
          };
        }
      }

      if (currentServiceKey && subheadingName && subheadingName.trim() !== "") {
        data[currentServiceKey].Subheading[subheadingName.trim()] = {
          colour: getCellData("Subheading").color,
        };
      }
    }

    // Replace empty subheadings with 0
    for (const serviceKey in data) {
      if (Object.keys(data[serviceKey].Subheading).length === 0) {
        data[serviceKey].Subheading = 0;
      }
    }

    return { [SHEET_NAME]: data };
  };

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}&ranges=${SHEET_NAME}&includeGridData=true`;
    const response = await axios.get(url);
    return parseSheetData(response.data);
  } catch (error) {
    console.error("Failed to fetch or parse Google Sheet data:", error);
    return {};
  }
};
