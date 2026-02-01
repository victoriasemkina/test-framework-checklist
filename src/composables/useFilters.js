import { computed, ref } from "vue";

export function useFilters(items) {
  const searchQuery = ref("");
  const selectedCategory = ref("all");
  const selectedPriority = ref("all");

  const filteredItems = computed(() => {
    return items.value.filter((item) => {
      // Фильтр по поиску
      if (
        searchQuery.value &&
        !item.text.toLowerCase().includes(searchQuery.value.toLowerCase())
      ) {
        return false;
      }

      // Фильтр по категории
      if (
        selectedCategory.value !== "all" &&
        item.categoryId !== selectedCategory.value
      ) {
        return false;
      }

      // Фильтр по приоритету
      if (
        selectedPriority.value !== "all" &&
        item.priority !== selectedPriority.value
      ) {
        return false;
      }

      return true;
    });
  });

  const resetFilters = () => {
    searchQuery.value = "";
    selectedCategory.value = "all";
    selectedPriority.value = "all";
  };

  return {
    searchQuery,
    selectedCategory,
    selectedPriority,
    filteredItems,
    resetFilters
  };
}
