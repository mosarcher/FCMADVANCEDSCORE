import { useState, useCallback } from "react";

export function useGameManagement() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [gameId, setGameId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveGame = useCallback(
    async (archers) => {
      if (archers.length === 0) {
        alert("Add some archers first!");
        return;
      }

      setIsSaving(true);
      try {
        const gameData = {
          game_date: currentDate,
          data: { archers },
        };

        let response;
        if (gameId) {
          response = await fetch(`/api/games/${gameId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameData),
          });
        } else {
          response = await fetch("/api/games", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameData),
          });
        }

        if (!response.ok) {
          throw new Error("Failed to save game");
        }

        const savedGame = await response.json();
        setGameId(savedGame.id);
        alert("Game saved!");
      } catch (error) {
        console.error("Error saving game:", error);
        alert("Could not save game");
      } finally {
        setIsSaving(false);
      }
    },
    [currentDate, gameId],
  );

  const startNewGame = useCallback((onConfirm) => {
    if (
      confirm(
        "Start a new game? Current game will be cleared (save first if needed).",
      )
    ) {
      setCurrentDate(new Date().toISOString().split("T")[0]);
      setGameId(null);
      onConfirm();
    }
  }, []);

  return {
    currentDate,
    setCurrentDate,
    gameId,
    setGameId,
    isSaving,
    saveGame,
    startNewGame,
  };
}
