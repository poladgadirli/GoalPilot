class ApiError extends Error {
  constructor(status, message, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}
const ACCESS_TOKEN_KEY = "AI_PLANNER_AUTH_TOKEN";
const REFRESH_TOKEN_KEY = "AI_PLANNER_REFRESH_TOKEN";
const USER_KEY = "AI_PLANNER_USER";
const USER_UPDATED_EVENT = "ai-planner-user-updated";
const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_URL ?? "").replace(/\/$/, "");
function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
function isAuthenticated() {
  return Boolean(getStoredAccessToken());
}
function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function setStoredUser(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT, { detail: user }));
}
function storeAuth(payload) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  setStoredUser(payload.user);
}
function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  setStoredUser(null);
}
function buildApiUrl(path) {
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  if (!BACKEND_BASE_URL) {
    return endpoint;
  }
  return `${BACKEND_BASE_URL}${endpoint}`;
}
function extractErrorMessage(payload, fallback) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  if ("message" in payload && payload.message) {
    const data = payload.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const fieldMessage = Object.values(data).find((value) => typeof value === "string");
      if (fieldMessage) {
        return fieldMessage;
      }
    }
    return String(payload.message);
  }
  return fallback;
}
async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return false;
  }
  const response = await fetch(buildApiUrl("/api/auth/refresh-token"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  const text = await response.text();
  if (!response.ok || !text) {
    return false;
  }
  try {
    const payload = JSON.parse(text);
    if (!payload?.success || !payload?.data) {
      return false;
    }
    storeAuth(payload.data);
    return true;
  } catch {
    return false;
  }
}
async function requestJson(path, init = {}, retryOnUnauthorized = true) {
  const token = getStoredAccessToken();
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...init.headers ?? {}
    }
  });
  if (response.status === 401 && retryOnUnauthorized && getStoredRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return requestJson(path, init, false);
    }
    clearAuth();
  }
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new ApiError(response.status, "Invalid response from server", text);
    }
  }
  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(payload, response.statusText),
      payload
    );
  }
  if (payload && typeof payload === "object" && "success" in payload) {
    const apiPayload = payload;
    if (!apiPayload.success) {
      throw new ApiError(
        response.status,
        extractErrorMessage(apiPayload, apiPayload.message ?? "Request failed"),
        payload
      );
    }
    return apiPayload.data;
  }
  return payload;
}
async function login(email, password) {
  return requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier: email, password })
  });
}
async function register(name, username, email, password) {
  return requestJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, username, email, password })
  });
}
async function logout() {
  const refreshToken = getStoredRefreshToken();
  if (refreshToken) {
    try {
      await requestJson("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken })
      });
    } catch {
    }
  }
  clearAuth();
}
async function getCurrentUser() {
  return requestJson("/api/users/me");
}
async function updateCurrentUserProfile(input) {
  const user = await requestJson("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  setStoredUser(user);
  return user;
}
async function fetchTasks(size = 20) {
  return requestJson(`/api/tasks?size=${size}`);
}
async function fetchTasksWithParams(params = {}) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  return requestJson(`/api/tasks${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
}
async function fetchTaskById(id) {
  return requestJson(`/api/tasks/${id}`);
}
async function createTask(input) {
  return requestJson("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
async function updateTask(id, input) {
  return requestJson(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}
async function updateTaskImportant(id, important) {
  const searchParams = new URLSearchParams({ important: String(important) });
  return requestJson(`/api/tasks/${id}/important?${searchParams.toString()}`, {
    method: "PATCH"
  });
}
async function fetchGoals() {
  return requestJson("/api/goals");
}
async function fetchGoalById(id) {
  return requestJson(`/api/goals/${id}`);
}
async function fetchCategories() {
  return requestJson("/api/categories");
}
async function createCategory(input) {
  return requestJson("/api/categories", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
async function updateCategory(id, input) {
  return requestJson(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}
async function deleteCategory(id) {
  return requestJson(`/api/categories/${id}`, {
    method: "DELETE"
  });
}
async function createGoalRecommendation(title, description) {
  return requestJson("/api/goal-recommendations", {
    method: "POST",
    body: JSON.stringify({ title, description: description ?? "" })
  });
}
async function createGoal(input) {
  return requestJson("/api/goals", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
async function deleteGoal(id) {
  return requestJson(`/api/goals/${id}`, {
    method: "DELETE"
  });
}
async function fetchPlanByGoalId(goalId) {
  try {
    return await requestJson(`/api/goals/${goalId}/plans`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 404)) {
      return null;
    }
    throw error;
  }
}
async function fetchPlanProgress(planId) {
  return requestJson(`/api/plans/${planId}/progress`);
}
async function completePlanTask(id) {
  return requestJson(`/api/plan-tasks/${id}/complete`, {
    method: "PATCH"
  });
}
async function generateAiPlan(goalId) {
  return requestJson(`/api/goals/${goalId}/plans/generate-ai`, {
    method: "POST"
  });
}
export {
  ApiError,
  clearAuth,
  createGoal,
  createGoalRecommendation,
  createCategory,
  createTask,
  completePlanTask,
  deleteCategory,
  deleteGoal,
  fetchCategories,
  fetchGoalById,
  fetchGoals,
  fetchPlanByGoalId,
  fetchPlanProgress,
  fetchTaskById,
  fetchTasks,
  fetchTasksWithParams,
  generateAiPlan,
  getCurrentUser,
  getStoredUser,
  isAuthenticated,
  login,
  logout,
  register,
  setStoredUser,
  storeAuth,
  USER_UPDATED_EVENT,
  updateCategory,
  updateCurrentUserProfile,
  updateTaskImportant,
  updateTask
};
