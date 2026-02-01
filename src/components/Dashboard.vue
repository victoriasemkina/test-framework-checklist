<template>
  <div class="dashboard">
    <div class="maturity-card">
      <div class="maturity-circle">
        <div class="maturity-circle-inner">
          <span class="maturity-score">{{ score }}</span>
          <span class="maturity-percent">%</span>
        </div>
      </div>
      <div class="maturity-info">
        <h2>Уровень зрелости</h2>
        <div class="maturity-level">
          <span class="level-emoji">{{ level.emoji }}</span>
          <span class="level-name">{{ level.label }}</span>
        </div>
        <div class="progress-container">
          <div
            class="progress-bar"
            :style="{ width: `${score}%` }"
          ></div>
        </div>
        <div class="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">Выполнено</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.remainingTime }}ч</div>
          <div class="stat-label">часов до идеала</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completionPercent }}</div>
          <div class="stat-label">прогресс</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  score: Number,
  level: Object,
  stats: Object
});
</script>

<style scoped>
.dashboard {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.maturity-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 30px;
}

.maturity-circle {
  width: 200px;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInUp 0.6s ease-out;
}

.maturity-circle::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--success) calc(var(--score, 0) * 1%),
    var(--gray-200) calc(var(--score, 0) * 1%),
    var(--gray-200) 100%
  );
  transition: background 1s ease;
}

.maturity-circle::after {
  content: "";
  position: absolute;
  width: 160px;
  height: 160px;
  background: var(--bg-primary);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.maturity-circle-inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

.maturity-score {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: var(--transition);
}

.maturity-percent {
  font-size: 1.5rem;
  color: var(--gray-500);
}

.maturity-info {
  flex: 1;
  min-width: 300px;
}

.maturity-info h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--gray-700);
}

.maturity-level {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border-radius: 24px;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  box-shadow: var(--shadow-md);
}

.maturity-level .level-emoji {
  font-size: 1.6rem;
}

.progress-container {
  width: 100%;
  height: 16px;
  background: var(--gray-200);
  border-radius: 8px;
  overflow: hidden;
  margin: 15px 0;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 8px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--gray-500);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition);
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
</style>
