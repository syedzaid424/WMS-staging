import { warehouseApiRoutes } from "../app/main/warehouse/utils/apiRoutes";
import { useAuthStore } from "../store/auth/authStore";
import { message } from "antd";

const downloadPDF = async (body: any, filename = "qrcode.pdf") => {
  const { accessToken } = useAuthStore.getState();
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${warehouseApiRoutes.getQRcode}`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (url && response?.status == 200) {
    message.success(`File downloaded as ${filename}`);
    return true;
  } else {
    message.error("Something went wrong");
  }
};

export const sortMinMaxInRange = (range: number[], order = "asc") => {
  return range.sort((a, b) => (order === "asc" ? a - b : b - a));
};

export { downloadPDF };
