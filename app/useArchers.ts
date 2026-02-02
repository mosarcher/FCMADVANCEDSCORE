"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ztqodnllkjzrtazgjnoe.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cW9kbmxsa2p6cnRhemdqbm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTQ4NTMsImV4cCI6MjA4NTUzMDg1M30.h8BnkX8CC00LuxOuP6g9FfAL8eTaY20IzA3tKRo3Gog";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useArchers() {
  const [archers, setArchers] = useState<any[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [pastGames, setPastGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPool = useCallback(async () => {
    const { data, error } = await supabase
      .from("archers_list")
      .select("name")
      .order("name");

    if (!error && data) {
      setPool(data.map((d) => d.name));
    }
  }, []);

  const fetchPastGames = useCallback(async () => {
    const { data, error } = await supabase
      .from("past_games")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPastGames(data);
    }
  }, []);

  const loadSession = useCallback(async () => {
    const { data } = await supabase
      .from("active_session")
      .select("state")
      .eq("id", 1)
      .maybeSingle();

    if (data?.state) {
      setArchers(data.state);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPool();
    fetchPastGames();
    loadSession();
  }, [fetchPool, fetchPastGames, loadSession]);

  const saveCurrentSession = async (state: any[]) => {
    if (state.length === 0) {
      await supabase.from("active_session").delete().eq("id", 1);
    } else {
      await supabase.from("active_session").upsert({ id: 1, state });
    }
  };

  const archiveGame = async (state: any[]) => {
    if (state.length === 0) return;
    const { error } = await supabase
      .from("past_games")
      .insert([{ game_data: state }]);
    if (!error) {
      await supabase.from("active_session").delete().eq("id", 1);
      setArchers([]);
      fetchPastGames();
    }
  };

  const deletePastGame = async (id: string) => {
    const { error } = await supabase.from("past_games").delete().eq("id", id);
    if (!error) fetchPastGames();
  };

  const addToPool = async (name: string) => {
    const { error } = await supabase.from("archers_list").insert([{ name }]);
    if (!error) {
      fetchPool();
    }
  };

  const removeFromPool = async (name: string) => {
    const { error } = await supabase
      .from("archers_list")
      .delete()
      .eq("name", name);
    if (!error) fetchPool();
  };

  return {
    archers,
    setArchers,
    pool,
    loading,
    pastGames,
    addToPool,
    removeFromPool,
    saveCurrentSession,
    archiveGame,
    deletePastGame,
  };
}
