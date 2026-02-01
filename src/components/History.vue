<template>
  <div class="history-section">
    <div class="section-header">
      <h2><i class="fas fa-chart-line"></i> История прогресса</h2>
      <div class="section-actions">
        <button
          class="btn btn-outline btn-sm"
          @click="handleExportCsv"
        >
          <i class="fas fa-file-csv"></i> Экспортировать CSV
        </button>
      </div>
    </div>

    <div class="history-content">
      <div class="history-chart-container">
        <div
          v-if="history.length === 0"
          class="empty-history"
        >
          <i class="fas fa-chart-line"></i>
          <h3>История пока пуста</h3>
          <p>Отмечайте критерии, и здесь появится график вашего прогресса</p>
        </div>
        <canvas
          v-else
          id="progressChart"
        ></canvas>
      </div>

      <div
        v-if="history.length > 0"
        class="history-stats"
      >
        <div class="history-stat-card">
          <div class="history-stat-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="history-stat-content">
            <div class="history-stat-value">{{ daysTracked }}</div>
            <div class="history-stat-label">дней отслежено</div>
          </div>
        </div>

        <div class="history-stat-card">
          <div class="history-stat-icon">
            <i class="fas fa-arrow-up"></i>
          </div>
          <div class="history-stat-content">
            <div
              class="history-stat-value"
              :style="{ color: improvementColor }"
            >
              {{ improvement }}%
            </div>
            <div class="history-stat-label">улучшение</div>
          </div>
        </div>

        <div class="history-stat-card">
          <div class="history-stat-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="history-stat-content">
            <div class="history-stat-value">{{ bestScore }}%</div>
            <div class="history-stat-label">лучший результат</div>
          </div>
        </div>

        <div class="history-stat-card">
          <div class="history-stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="history-stat-content">
            <div class="history-stat-value">{{ firstRecord }}</div>
            <div class="history-stat-label">первый замер</div>
          </div>
        </div>
      </div>

      <div
        v-if="history.length > 0"
        class="history-table-container"
      >
        <table class="history-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Зрелость</th>
              <th>Выполнено</th>
              <th>Всего</th>
              <th>Изменение</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in sortedHistory"
              :key="index"
            >
              <td>{{ formatDate(entry.date) }}</td>
              <td class="progress-cell">{{ entry.percent }}%</td>
              <td>{{ entry.completed }}</td>
              <td>{{ entry.total }}</td>
              <td
                class="change-cell"
                :class="getChangeClass(index)"
              >
                {{ getChangeText(index) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import { computed, onMounted, onUnmounted, watch } from "vue";

Chart.register(...registerables);

const props = defineProps({
  history: Array
});

const emit = defineEmits(["export-csv"]);

let chartInstance = null;

const daysTracked = computed(() => {
  if (props.history.length < 2) return 0;
  const first = new Date(props.history[0].date);
  const last = new Date(props.history[props.history.length - 1].date);
  return Math.ceil((last - first) / (1000 * 60 * 60 * 24)) + 1;
});

const improvement = computed(() => {
  if (props.history.length < 2) return 0;
  return (
    props.history[props.history.length - 1].percent - props.history[0].percent
  );
});

const improvementColor = computed(() => {
  return improvement.value > 0
    ? "var(--success)"
    : improvement.value < 0
    ? "var(--danger)"
    : "var(--gray-500)";
});

const bestScore = computed(() => {
  return Math.max(...props.history.map((e) => e.percent), 0);
});

const firstRecord = computed(() => {
  if (props.history.length === 0) return "-";
  return new Date(props.history[0].date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
});

const sortedHistory = computed(() => {
  return [...props.history].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getChangeClass = (index) => {
  if (index === sortedHistory.value.length - 1) return "neutral";
  const current = sortedHistory.value[index].percent;
  const next = sortedHistory.value[index + 1].percent;
  const change = current - next;
  return change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
};

const getChangeText = (index) => {
  if (index === sortedHistory.value.length - 1) return "-";
  const current = sortedHistory.value[index].percent;
  const next = sortedHistory.value[index + 1].percent;
  const change = current - next;
  if (change === 0) return "-";
  return `${change > 0 ? "+" : ""}${change}%`;
};

const handleExportCsv = () => {
  emit("export-csv");
};

const drawData = (dates, percents) => {
  if (chartInstance) {
    chartInstance.data.labels = dates;
    chartInstance.data.datasets[0].data = percents;
    chartInstance.update("active");
  }
};

const renderChart = () => {
  const ctx = document.getElementById("progressChart");
  if (!ctx) return;

  const dates = props.history.map((entry) => {
    const date = new Date(entry.date);
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
  });

  const percents = props.history.map((entry) => entry.percent);

  if (chartInstance) {
    drawData(dates, percents);
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Уровень зрелости (%)",
          percents,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: true,
          cubicInterpolationMode: "monotone"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(31, 41, 55, 0.9)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#6366f1",
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(0, 0, 0, 0.05)"
          },
          ticks: {
            color: "var(--text-secondary)",
            callback: function (value) {
              return value + "%";
            }
          },
          border: {
            color: "rgba(0, 0, 0, 0.1)"
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "var(--text-secondary)"
          },
          border: {
            color: "rgba(0, 0, 0, 0.1)"
          }
        }
      },
      interaction: {
        intersect: false,
        mode: "nearest"
      },
      animation: {
        duration: 1000,
        easing: "easeOutQuart"
      }
    }
  });

  
    drawData(dates, percents);
};

watch(
  () => props.history,
  () => {
    if (props.history.length > 0) {
      renderChart();
    }
  },
  { deep: true, flush: "post" }
);

onMounted(() => {
  if (props.history.length > 0) {
    renderChart();
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.history-section {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
}

.history-content {
  margin-top: 20px;
}

.history-chart-container {
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid var(--gray-200);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-history {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-500);
}

.empty-history i {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-history h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--gray-700);
}

.empty-history p {
  font-size: 1.1rem;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.history-stat-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: var(--transition);
  border: 2px solid transparent;
}

.history-stat-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.history-stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.history-stat-content {
  flex: 1;
}

.history-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  display: block;
}

.history-stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: block;
}

.history-table-container {
  overflow-x: auto;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-200);
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.history-table thead {
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--gray-200);
}

.history-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
}

.history-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-200);
  color: var(--text-primary);
  font-size: 0.95rem;
}

.history-table tr:last-child td {
  border-bottom: none;
}

.history-table tr:hover {
  background: var(--bg-secondary);
}

.history-table td:first-child {
  font-weight: 500;
  color: var(--gray-800);
}

.history-table .progress-cell {
  font-weight: 700;
  color: var(--primary);
}

.history-table .change-cell.positive {
  color: var(--success);
  font-weight: 600;
}

.history-table .change-cell.negative {
  color: var(--danger);
  font-weight: 600;
}

.history-table .change-cell.neutral {
  color: var(--gray-500);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.4rem;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-header h2 i {
  color: var(--primary);
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn-outline {
  background: transparent;
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.btn-outline:hover {
  background: var(--gray-100);
  border-color: var(--gray-400);
}
</style>
