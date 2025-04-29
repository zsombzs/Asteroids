import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js'
const supabaseUrl = 'https://sfoxssmeqehdejbvmuus.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb3hzc21lcWVoZGVqYnZtdXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjMxOTcsImV4cCI6MjA2MTUzOTE5N30.m9Sr5Nw4fy2oFNBQHrl-9bwzDPz_t7CTviQw4k4CBzc'
export const supabase = createClient(supabaseUrl, supabaseKey)
