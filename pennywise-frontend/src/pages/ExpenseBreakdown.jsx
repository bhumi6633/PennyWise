'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { getAuthHeaders } from '../utils/auth';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpenseBreakdownChart = () => {
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/expenses`,
          getAuthHeaders()
        );

        const expenses = Array.isArray(res.data) ? res.data : res.data.expenses;

        const totals = {};
        for (const expense of expenses) {
          const { category, amount } = expense;
          if (category && typeof amount === 'number') {
            totals[category] = (totals[category] || 0) + amount;
          }
        }

        setCategoryData(totals);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };

    fetchExpenses();
  }, []);

  const labels = Object.keys(categoryData);
  const values = Object.values(categoryData);

  const colors = [
    '#2d6a4f', '#f4a261', '#e76f51', '#a8dadc',
    '#457b9d', '#ffbe0b', '#8338ec', '#ff006e'
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#1a1a1a',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: { size: 16 },
        },
      },
      title: {
        display: true,
        text: 'Detailed Expense Breakdown',
        color: '#fff',
        font: { size: 28, weight: 'bold' },
        padding: { bottom: 20 },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {labels.length > 0 ? (
        <div style={{ width: '450px', height: '450px' }}>
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: '#ccc', fontSize: '18px' }}>No spending data available.</p>
      )}
    </div>
  );
};

export default ExpenseBreakdownChart;
