import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

export function usePastGames() {
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load games from Supabase
  const loadPastGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("past_games")
        .select("*")
        .order("game_date", { ascending: false });

      if (error) {
        console.error("Error loading past games:", error.message);
      } else {
        setPastGames(data || []);
      }
    } catch (err) {
      console.error("Unexpected error loading games:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Save or Update a game
  const saveGame = async (
    archers: any[],
    gameId: string | null = null,
    currentDate: string = new Date().toISOString()
  ) => {
    try {
      const { error } = await supabase.from("past_games").upsert({
        id: gameId || undefined,
        game_date: currentDate,
        data: { archers },
      });

      if (error) {
        console.error("Error saving game:", error.message);
        alert("Failed to save game. Check connection.");
      } else {
        await loadPastGames();
        alert("Game saved successfully!");
      }
    } catch (err) {
      console.error("Unexpected error saving game:", err);
    }
  };

  // 3. Delete a game
  const deleteGame = async (id: string) => {
    try {
      const { error } = await supabase.from("past_games").delete().eq("id", id);

      if (error) {
        console.error("Error deleting game:", error.message);
      } else {
        await loadPastGames();
      }
    } catch (err) {
      console.error("Unexpected error deleting game:", err);
    }
  };

  // Initial load
  useEffect(() => {
    loadPastGames();
  }, [loadPastGames]);

  return { pastGames, saveGame, deleteGame, loadPastGames, isLoading };
}
