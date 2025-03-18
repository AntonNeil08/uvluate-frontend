import axios from "axios";

// ✅ Initialize Axios with Vite-compatible environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Ensures authentication and cookies
});

// ✅ Request Interceptor for Debugging
api.interceptors.request.use(
  (request) => {
    console.log("🟢 Axios Request:", request);
    return request;
  },
  (error) => {
    console.error("❌ Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor for Debugging
api.interceptors.response.use(
  (response) => {
    console.log("🟢 Axios Response:", response);
    return response;
  },
  (error) => {
    console.error("❌ Axios Response Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Handle errors globally
const handleError = (error) => {
  return error.response?.data || { success: false, message: error.message || "Unknown error" };
};

// ✅ Converts JSON to FormData (Handles files, objects, arrays)
const toFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    console.log(`📤 Appending: ${key} =>`, value);

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value, value.name);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        formData.append(`${key}[${subKey}]`, subValue);
      });
    } else {
      formData.append(key, value);
    }
  });

  console.log("🔹 Final FormData Contents Before Sending:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  return formData;
};

// ✅ GET Request (Uses query parameters)
export const apiGet = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ POST Request (Always Uses FormData)
export const apiPost = async (url, data = {}) => {
  try {
    let formData = toFormData(data); // ✅ Convert data to FormData

    console.log("📤 API Request to:", url);
    console.log("📦 FormData Before Sending:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // Debugging output
    }

    const response = await api.post(url, formData); // ✅ No need to set headers, Axios handles it
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return handleError(error);
  }
};

// ✅ PUT Request (Always Uses FormData)
export const apiPut = async (url, data = {}) => {
  try {
    let formData = toFormData(data);
    const response = await api.put(url, formData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ PATCH Request (Always Uses FormData)
export const apiPatch = async (url, data = {}) => {
  try {
    let formData = toFormData(data);
    const response = await api.patch(url, formData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ DELETE Request (Always Uses FormData)
export const apiDelete = async (url, data = {}) => {
  try {
    let formData = toFormData(data);
    const response = await api.delete(url, { data: formData });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
