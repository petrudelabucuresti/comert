export const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};