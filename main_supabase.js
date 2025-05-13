import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://sfoxssmeqehdejbvmuus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb3hzc21lcWVoZGVqYnZtdXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NzAwNTgsImV4cCI6MjA2MTU0NjA1OH0.qVbnzC78V4Lw_MDszOitMpv3sztdTxvUxt9EEYk5Z7c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchTopScores() {
  const { data, error } = await supabase
    .from('scores')
    .select('score, name')
    .order('score', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Hiba a pontszámok lekérésekor:', error);
    return;
  }

  const col1 = document.getElementById('score-col-1');
  const col2 = document.getElementById('score-col-2');

  col1.innerHTML = '';
  col2.innerHTML = '';

  data.forEach((entry, index) => {
    const row = document.createElement('tr');
    const nameToShow = entry.name ? entry.name : 'Anonymous';

    if (index < 5) {
      row.innerHTML = `
        <td>${index + 1} - ${nameToShow}</td>
        <td>${entry.score}</td>
      `;
    } else {
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.score}</td>
      `;
    }
    if (index < 10) {
      col1.appendChild(row);
    } else {
      col2.appendChild(row);
    }

    if (index === 0) {
        row.classList.add('gold');
      } else if (index === 1) {
        row.classList.add('silver');
      } else if (index === 2) {
        row.classList.add('bronze');
      }
  });
}

fetchTopScores();
