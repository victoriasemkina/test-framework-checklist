<template>
  <div class="action-bar">
    <div class="action-bar-left">
      <button
        class="btn btn-primary"
        @click="handleSave"
      >
        <i class="fas fa-save"></i> Сохранить результаты
      </button>
      <button
        class="btn btn-secondary"
        @click="handleReset"
      >
        <i class="fas fa-redo"></i> Сбросить всё
      </button>
    </div>
    <div class="action-bar-right">
      <button
        class="btn btn-export"
        @click="handleExport"
      >
        <i class="fas fa-file-export"></i> Экспортировать
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["save", "reset", "export"]);

const handleSave = () => emit("save");
const handleReset = () => {
  if (confirm("Вы уверены, что хотите сбросить все отметки?")) {
    emit("reset");
  }
};
const handleExport = () => emit("export");
</script>

<style scoped>
.action-bar {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  margin-bottom: 30px;
}

.action-bar-left,
.action-bar-right {
  display: flex;
  gap: 12px;
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

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #4338ca 100%);
}

.btn-secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  color: white;
}

.btn-export {
  background: linear-gradient(135deg, var(--success) 0%, #0da271 100%);
  color: white;
}

.btn-export:hover {
  background: linear-gradient(135deg, #0da271 0%, #0a8a60 100%);
}
</style>
