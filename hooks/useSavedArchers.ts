import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export function useSavedArchers() {
  const [savedArchers, setSavedArchers] = useState<any[]>([]);

  const loadSavedArchers = async () => {
    const { data, error } = await supabase
      .from("saved_archers")
      .select("*")
      .order("name", { ascending: true });

    if (!error) setSavedArchers(data || []);
  };

  const saveArcherName = async (name: string) => {
    const { error } = await supabase
      .from("saved_archers")
      .insert([{ name: name.trim() }]);

    if (!error) loadSavedArchers();
  };

  const deleteSavedArcher = async (id: string) => {
    const { error } = await supabase
      .from("saved_archers")
      .delete()
      .eq("id", id);

    if (!error) loadSavedArchers();
  };

  useEffect(() => {
    loadSavedArchers();
  }, []);

  return { savedArchers, saveArcherName, deleteSavedArcher, loadSavedArchers };
}
