import React, { useState, useEffect } from 'react';
import './App.css';
import DataTable from './components/DataTable';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('/data2.txt');
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }
        
        const text = await response.text();
        const parsedData = JSON.parse(text);

        setData(parsedData);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ежемесячный отчёт по объектам</h1>
      </header>
      
      <main>
        <DataTable data={data} />
      </main>
      
    </div>
  );
}

export default App;
