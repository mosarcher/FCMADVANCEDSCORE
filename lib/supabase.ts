"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase configuratie direct in de hook om import-fouten te voorkomen
const supabaseUrl = "https://ztqodnllkjzrtazgjnoe.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cW9kbmxsa2p6cnRhemdqbm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTQ4NTMsImV4cCI6MjA4NTUzMDg1M30.h8BnkX8CC00LuxOuP6g9FfAL8eTaY20IzA3tKRo3Gog";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Archer {
  id: string;
  name: string;
  scores: (string | number)[];
}

export function useArchers() {
  const [archers, setArchers] = useState<Archer[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCloudNames = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("archers_list")
        .select("name")
        .order("name", { ascending: true });

      if (!error && data) {
        setSavedNames(data.map((d) => d.name));
      }
    } catch (err) {
      console.error("Database verbinding mislukt:", err);
    }
  }, []);

  useEffect(() => {
    fetchCloudNames().then(() => setLoading(false));
  }, [fetchCloudNames]);

  const addSavedName = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const { error } = await supabase
        .from("archers_list")
        .insert([{ name: trimmed }]);
      if (!error) fetchCloudNames();
    },
    [fetchCloudNames]
  );

  const removeSavedName = useCallback(
    async (nameToRemove: string) => {
      const { error } = await supabase
        .from("archers_list")
        .delete()
        .eq("name", nameToRemove);
      if (!error) fetchCloudNames();
    },
    [fetchCloudNames]
  );

  const calculateTotal = (scores: (string | number)[]) =>
    scores.reduce((a, b) => a + (parseInt(b.toString()) || 0), 0);

  const addArcher = useCallback((name: string = "") => {
    const newId = Math.random().toString(36).substr(2, 9);
    setArchers((prev) => [
      ...prev,
      { id: newId, name, scores: Array(50).fill("") },
    ]);
    setExpandedId(newId);
  }, []);

  const updateScore = useCallback((id: string, idx: number, val: string) => {
    setArchers((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, scores: a.scores.map((s, i) => (i === idx ? val : s)) }
          : a
      )
    );
  }, []);

  const sortedArchers = [...archers].sort(
    (a, b) => calculateTotal(b.scores) - calculateTotal(a.scores)
  );

  return {
    archers: sortedArchers,
    savedNames,
    expandedId,
    loading,
    addArcher,
    addSavedName,
    removeSavedName,
    updateScore,
    calculateTotal,
    startNewGame: () => {
      if (confirm("Nieuw spel starten?")) {
        setArchers([]);
        return true;
      }
      return false;
    },
    deleteArcher: (id: string) =>
      setArchers((prev) => prev.filter((a) => a.id !== id)),
    updateName: (id: string, name: string) =>
      setArchers((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a))),
    toggleExpand: (id: string) =>
      setExpandedId((prev) => (prev === id ? null : id)),
  };
}
