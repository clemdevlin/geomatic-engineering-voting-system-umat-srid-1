import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `http://localhost:5000/api`;

/**
 * Deletes an election by ID (admin only)
 * @param {string} electionId - The ID of the election to delete
 * @param {string} token - JWT or auth token (if using Bearer token auth)
 * @returns {Promise<Object>} { success: boolean, message?: string, error?: string }
 */
export async function deleteElection(electionId, token) {
  if (!electionId) {
    return { success: false, error: 'Election ID is required' };
  }

  const url = `${API}/admin/elections/${electionId}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle known backend error messages
      const errorMessage = data.detail || 'Failed to delete election';
      toast.error(errorMessage)
      return { success: false, error: errorMessage };
    }

    // Success
    toast.success(data.message || 'Election deleted successfully')
    return { success: true, message: data.message || 'Election deleted successfully' };

  } catch (error) {
    console.error('Delete Election Error:', error);
    toast.error(error?.response?.data?.detail || "Network Error or Internal Server Error")
    return { success: false, error: error?.response?.data?.detail || "Network Error or Internal Server Error" };
  }
}