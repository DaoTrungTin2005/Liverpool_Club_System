// src/services/playerService.js
import api from "./apitoken.js";

export const playerService = {
  // Lấy danh sách thủ môn
  getGoalkeepers: async () => {
    try {
      const response = await api.get("/api/players/goalkeepers");
      return response.data;
    } catch (error) {
      console.error("Error fetching goalkeepers:", error);
      throw error;
    }
  },

  // Lấy danh sách hậu vệ
  getDefenders: async () => {
    try {
      const response = await api.get("/api/players/defenders");
      return response.data;
    } catch (error) {
      console.error("Error fetching defenders:", error);
      throw error;
    }
  },

  // Lấy danh sách tiền vệ
  getMidfielders: async () => {
    try {
      const response = await api.get("/api/players/midfielders");
      return response.data;
    } catch (error) {
      console.error("Error fetching midfielders:", error);
      throw error;
    }
  },

  // Lấy danh sách tiền đạo
  getAttackers: async () => {
    try {
      const response = await api.get("/api/players/attackers");
      return response.data;
    } catch (error) {
      console.error("Error fetching attackers:", error);
      throw error;
    }
  },

  getPlayerProfile: async (playerId) => {
    const response = await api.get(`/api/players/${playerId}/profile`);
    return response.data;
  },

  // Lấy stats chi tiết (matches, goals, assists by tournament)
  getPlayerStats: async (playerId) => {
    const response = await api.get(`/api/players/${playerId}/stats`);
    return response.data;
  },
};
