import { ref, computed, onMounted } from 'vue'

export function useChecklist(checklistData) {
  // Реактивное состояние
  const completedItems = ref(new Set(JSON.parse(localStorage.getItem('checklist_completed')) || []))
  const items = ref([])
  
  // Собираем все критерии
  const initItems = () => {
    items.value = []
    checklistData.categories.forEach(category => {
      category.items.forEach(item => {
        items.value.push({
          ...item,
          categoryId: category.id,
          categoryName: category.name,
          categoryColor: category.color
        })
      })
    })
  }
  
  // Вычисляемые свойства
  const totalItems = computed(() => items.value.length)
  const totalCategories = computed(() => checklistData.categories.length)
  const score = computed(() => {
    if (totalItems.value === 0) return 0
    return Math.round((completedItems.value.size / totalItems.value) * 100)
  })
  
  const currentLevel = computed(() => {
    return checklistData.maturityLevels.find(l => 
      score.value >= l.min && score.value <= l.max
    ) || checklistData.maturityLevels[0]
  })
  
  const stats = computed(() => ({
    completed: completedItems.value.size,
    remainingTime: calculateRemainingTime(),
    completionPercent: `${score.value}%`
  }))
  
  // Методы
  const toggleItem = (itemId) => {
    if (completedItems.value.has(itemId)) {
      completedItems.value.delete(itemId)
    } else {
      completedItems.value.add(itemId)
    }
    saveToLocalStorage()
  }
  
  const calculateRemainingTime = () => {
    return items.value.reduce((total, item) => {
      return completedItems.value.has(item.id) ? total : total + item.timeToFix
    }, 0)
  }
  
  const saveToLocalStorage = () => {
    localStorage.setItem('checklist_completed', JSON.stringify(Array.from(completedItems.value)))
  }
  
  const saveResults = () => {
    saveToLocalStorage()
    alert('✅ Результаты сохранены!')
  }
  
  const resetAll = () => {
    completedItems.value.clear()
    saveToLocalStorage()
    alert('✅ Все отметки сброшены!')
  }
  
  // Хуки
  onMounted(() => {
    initItems()
    console.log(`✅ Загружено ${totalItems.value} критериев`)
  })
  
  return {
    items,
    completedItems,
    totalItems,
    totalCategories,
    score,
    currentLevel,
    stats,
    toggleItem,
    saveResults,
    resetAll
  }
}