import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://sfoxssmeqehdejbvmuus.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb3hzc21lcWVoZGVqYnZtdXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NzAwNTgsImV4cCI6MjA2MTU0NjA1OH0.qVbnzC78V4Lw_MDszOitMpv3sztdTxvUxt9EEYk5Z7c'
export const supabase = createClient(supabaseUrl, supabaseKey)
