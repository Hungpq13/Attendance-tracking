/**
 * Date Formatter Utilities
 * Tiện ích để format các định dạng ngày tháng khác nhau
 */

/**
 * Format ngày tháng từ nhiều định dạng khác nhau sang DD/MM/YYYY
 * @param {string|array} dateValue - Giá trị ngày tháng
 * @returns {string} Ngày tháng định dạng DD/MM/YYYY
 */
export const formatDateDisplay = (dateValue) => {
  if (!dateValue) return "";

  let formattedDate = "";

  // Nếu là mảng [year, month, day]
  if (Array.isArray(dateValue)) {
    const [year, month, day] = dateValue;
    formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  }
  // Nếu là string
  else if (typeof dateValue === "string") {
    // Nếu có ký tự T (ISO format)
    const datePart = dateValue.includes("T") ? dateValue.split("T")[0] : dateValue;
    const [year, month, day] = datePart.split("-");
    formattedDate = `${day}/${month}/${year}`;
  }

  return formattedDate;
};

/**
 * Convert ngày từ DD/MM/YYYY sang YYYY-MM-DD
 * @param {string} dateString - Ngày định dạng DD/MM/YYYY
 * @returns {string} Ngày định dạng YYYY-MM-DD
 */
export const formatDateForAPI = (dateString) => {
  if (!dateString) return "";

  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};
