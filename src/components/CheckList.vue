<template>
  <div class="checklist-section">
    <div class="section-header">
      <h2><i class="fas fa-clipboard-list"></i> Чек-лист</h2>
      <div class="section-actions">
        <span class="items-counter">{{ visibleCount }}</span> из <span>{{ totalItems }}</span>
      </div>
    </div>
    <div class="categories-container">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="category-card"
      >
        <div class="category-header" @click="toggleCategory(category.id)">
          <h3>
            <i class="fas fa-folder"></i>
            {{ category.name }}
            <span class="category-counter">({{ getCategoryCount(category.id) }})</span>
          </h3>
          <i class="fas fa-chevron-down category-toggle" :class="{ rotated: expandedCategories[category.id] }"></i>
        </div>
        <div 
          class="category-content" 
          :style="{ display: expandedCategories[category.id] ? 'block' : 'none' }"
        >
          <p class="category-description">{{ category.description }}</p>
          <div class="checklist-items">
            <div 
              v-for="item in getCategoryItems(category.id)" 
              :key="item.id" 
              class="checklist-item"
              :class="{ completed: completedItems.has(item.id) }"
              @click="handleItemClick(item.id)"
            >
              <div 
                class="item-checkbox" 
                :class="{ checked: completedItems.has(item.id) }"
                @click.stop="handleToggle(item.id)"
              >
                <i class="fas fa-check"></i>
              </div>
              <div class="item-content">
                <div class="item-text">{{ item.text }}</div>
                <div class="item-meta">
                  <span class="priority-badge" :class="`priority-${item.priority}`">
                    <i class="fas fa-flag"></i> {{ priorities[item.priority].label }}
                  </span>
                  <span class="item-time">
                    <i class="fas fa-clock"></i> ~{{ item.timeToFix }}ч
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { checklistData } from '../data/checklistData'

const emit = defineEmits(['toggle'])

const props = defineProps({
  items: Array,
  completedItems: Object // Set
})

const priorities = checklistData.priorities
const categories = checklistData.categories

const expandedCategories = reactive({})
categories.forEach(cat => {
  expandedCategories[cat.id] = true
})

const visibleCount = computed(() => props.items.length)
const totalItems = computed(() => {
  return categories.reduce((sum, cat) => sum + cat.items.length, 0)
})

const getCategoryItems = (categoryId) => {
  return props.items.filter(item => item.categoryId === categoryId)
}

const getCategoryCount = (categoryId) => {
  const categoryItems = getCategoryItems(categoryId)
  const total = categories.find(c => c.id === categoryId)?.items.length || 0
  return `${categoryItems.length}/${total}`
}

const toggleCategory = (categoryId) => {
  expandedCategories[categoryId] = !expandedCategories[categoryId]
}

const handleItemClick = (itemId) => {
  emit('toggle', itemId)
}

const handleToggle = (itemId) => {
  emit('toggle', itemId)
}
</script>

<style scoped>
.checklist-section {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
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

.items-counter {
  font-weight: 600;
  color: var(--primary);
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.category-card {
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: var(--transition);
  animation: fadeInUp 0.5s ease-out;
  background: var(--bg-secondary);
}

.category-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateX(5px);
}

.category-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 20px 25px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.category-header h3 {
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-header h3 i {
  font-size: 1.4rem;
}

.category-toggle {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.category-toggle.rotated {
  transform: rotate(180deg);
}

.category-content {
  padding: 25px;
  background: var(--bg-secondary);
}

.category-description {
  color: var(--gray-600);
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.7;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checklist-item {
  background: var(--bg-primary);
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-sm);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.checklist-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--gray-300);
  transition: var(--transition);
}

.checklist-item:hover {
  border-color: var(--primary);
  transform: translateX(5px);
  box-shadow: var(--shadow-sm);
}

.checklist-item:hover::before {
  background: var(--primary);
}

.checklist-item.completed::before {
  background: var(--success);
}

.checklist-item.completed .item-checkbox {
  background: var(--success);
  border-color: var(--success);
}

.checklist-item.completed .item-text {
  text-decoration: line-through;
  color: var(--gray-500);
}

.item-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--gray-400);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: var(--transition);
  background: var(--bg-primary);
}

.item-checkbox i {
  color: white;
  font-size: 0.8rem;
  display: none;
}

.item-checkbox.checked i {
  display: block;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-text {
  font-size: 1.05rem;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.5;
  transition: var(--transition);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.85rem;
  color: var(--gray-500);
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-critical { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.priority-high { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.priority-medium { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.priority-low { background: rgba(107, 114, 128, 0.15); color: #6b7280; }

.item-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-time i {
  font-size: 0.9rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>