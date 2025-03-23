import axios from "axios";

// ✅ Initialize Axios with Vite-compatible environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Ensures authentication and cookies
});

// ✅ Request Interceptor for Debugging
api.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor for Debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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

  for (let pair of formData.entries()) {
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
    for (let pair of formData.entries()) {
    }

    const response = await api.post(url, formData); // ✅ No need to set headers, Axios handles it
    return response.data;
  } catch (error) {
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

export const apiJsonPost = async (url, data = {}) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

