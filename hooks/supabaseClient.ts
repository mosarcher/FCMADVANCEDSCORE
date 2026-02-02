import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ztqodnllkjzrtazgjnoe.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cW9kbmxsa2p6cnRhemdqbm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTQ4NTMsImV4cCI6MjA4NTUzMDg1M30.h8BnkX8CC00LuxOuP6g9FfAL8eTaY20IzA3tKRo3Gog";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
