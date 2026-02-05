<template>
  <div class="filters-section">
    <div class="section-header">
      <h2><i class="fas fa-filter"></i> Фильтры</h2>
    </div>
    <div class="filters-container">
      <div class="filter-group">
        <label><i class="fas fa-search"></i> Поиск</label>
        <input
          type="text"
          v-model="localSearch"
          placeholder="Поиск критериев..."
        />
      </div>
      <div class="filter-group">
        <label><i class="fas fa-tags"></i> Категория</label>
        <select v-model="localCategory">
          <option value="all">Все категории</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label><i class="fas fa-flag"></i> Приоритет</label>
        <select v-model="localPriority">
          <option value="all">Любой приоритет</option>
          <option value="critical">Критичный</option>
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>
      </div>
      <div class="filter-actions">
        <button
          class="btn btn-outline"
          @click="handleReset"
        >
          <i class="fas fa-times"></i> Сбросить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { checklistData } from "../data/checkListData";

const emit = defineEmits([
  "update:search",
  "update:category",
  "update:priority",
  "reset"
]);

const props = defineProps({
  search: String,
  category: String,
  priority: String
});

const localSearch = ref(props.search);
const localCategory = ref(props.category);
const localPriority = ref(props.priority);

const categories = computed(() => checklistData.categories);

// Синхронизация с родителем
watch(localSearch, (val) => emit("update:search", val));
watch(localCategory, (val) => emit("update:category", val));
watch(localPriority, (val) => emit("update:priority", val));

const handleReset = () => {
  localSearch.value = "";
  localCategory.value = "all";
  localPriority.value = "all";
  emit("reset");
};
</script>

<style scoped>
.filters-section {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 25px;
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

.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-700);
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-group label i {
  color: var(--primary);
  font-size: 0.95rem;
}

.filter-group input,
.filter-group select {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-sm);
  font-size: 0.95rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
  width: 100%;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.filter-group input::placeholder {
  color: var(--gray-400);
  transition: var(--transition);
}

.filter-actions {
  display: flex;
  gap: 10px;
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
