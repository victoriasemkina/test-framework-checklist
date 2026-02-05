<template>
  <div class="container" :data-theme="theme">
    <Header 
      :total-items="totalItems" 
      :total-categories="totalCategories"
      @toggle-theme="toggleTheme"
    />
    
    <Dashboard 
      :score="score" 
      :level="currentLevel" 
      :stats="stats"
    />
    
    <History 
      :history="history" 
      @export-csv="exportHistoryCsv"
    />
    
    <Filters 
      v-model:search="searchQuery"
      v-model:category="selectedCategory"
      v-model:priority="selectedPriority"
      @reset="resetFilters"
    />
    
    <Checklist 
      :items="filteredItems" 
      :completed-items="completedItems"
      @toggle="toggleItem"
    />
    
    <ActionBar 
      @save="saveResults"
      @reset="resetAll"
      @export="exportResults"
    />
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, provide } from 'vue'
import Header from './components/Header.vue'
import Dashboard from './components/Dashboard.vue'
import Filters from './components/Filters.vue'
import Checklist from './components/CheckList.vue'
import History from './components/History.vue'
import ActionBar from './components/ActionBar.vue'
import Footer from './components/Footer.vue'
import { checklistData } from './data/checklistData'
import { useChecklist } from './composables/useChecklist'
import { useFilters } from './composables/useFilters'
import { useTheme } from './composables/useTheme'
import { useHistory } from './composables/useHistory'
import { useExport } from './composables/useExport'

// Инициализация композиций
const { 
  items, 
  completedItems, 
  toggleItem, 
  score, 
  currentLevel, 
  stats, 
  totalItems, 
  totalCategories,
  saveResults,
  resetAll
} = useChecklist(checklistData)

const { 
  searchQuery, 
  selectedCategory, 
  selectedPriority, 
  filteredItems, 
  resetFilters 
} = useFilters(items)

const { 
  theme, 
  toggleTheme 
} = useTheme()

const { 
  history, 
  addHistoryEntry, 
  exportHistoryCsv 
} = useHistory()

const { 
  exportResults 
} = useExport(items, completedItems, score, currentLevel)

// Предоставляем тему для дочерних компонентов
provide('theme', theme)

// Следим за изменениями оценки для истории
watch(score, (newScore) => {
  addHistoryEntry(newScore, completedItems.value.size, items.value.length)
})

onMounted(() => {
  console.log('🚀 Test Framework Checklist на Vue 3 запущен!')
  console.log(`📊 Загружено ${totalItems.value} критериев`)
})
</script>