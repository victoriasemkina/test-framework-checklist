<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <div class="logo-icon">
          <i class="fas fa-clipboard-check"></i>
        </div>
        <div class="logo-text">
          <h1>Test Framework <span>Checklist</span></h1>
          <p class="subtitle">Интерактивная оценка здоровья и зрелости вашего тестового фреймворка</p>
        </div>
      </div>
      
      <div class="header-stats">
        <div class="stat-badge">
          <i class="fas fa-tasks"></i>
          <span>{{ totalItems }}</span> критериев
        </div>
        <div class="stat-badge">
          <i class="fas fa-layer-group"></i>
          <span>{{ totalCategories }}</span> категорий
        </div>
        
        <button class="theme-icon-btn" @click="handleToggleTheme" aria-label="Переключить тему">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  totalItems: Number,
  totalCategories: Number
})

const emit = defineEmits(['toggle-theme'])

const handleToggleTheme = () => {
  emit('toggle-theme')
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  border-radius: var(--border-radius);
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.logo-text h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.logo-text h1 span {
  color: #e0e7ff;
  font-weight: 300;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  font-weight: 300;
}

.header-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-badge i {
  font-size: 1.2rem;
}

.theme-icon-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  transition: var(--transition);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.theme-icon-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.theme-icon-btn:active {
  transform: scale(0.95);
}

.theme-icon-btn[data-theme="dark"] i {
  transform: rotate(180deg);
}
</style>