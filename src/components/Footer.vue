<template>
  <footer class="footer">
    <div class="footer-content">
      <p>
        <i class="fas fa-heart"></i> Создано для тестировщиков и разработчиков
      </p>
      <div class="footer-links">
        <a
          href="https://github.com/victoriasemkina/test-framework-checklist"
          target="_blank"
        >
          <i class="fab fa-github"></i> GitHub
        </a>
        <span>•</span>
        <a
          href="#"
          @click.prevent="showAbout"
          >О проекте</a
        >
      </div>
    </div>
  </footer>
</template>

<script setup>
const showAbout = () => {
  alert(
    "Test Framework Checklist\n\nИнтерактивный чек-лист для оценки здоровья и зрелости тестового фреймворка.\n\nСоздано с ❤️ для сообщества тестировщиков"
  );
};
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 30px;
  color: var(--gray-600);
  font-size: 0.95rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.footer-links a {
  color: var(--primary);
  text-decoration: none;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-links a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.footer-links span {
  color: var(--gray-400);
}
</style>
