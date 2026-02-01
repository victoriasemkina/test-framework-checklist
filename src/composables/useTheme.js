import { onMounted, ref } from "vue";

export function useTheme() {
  const theme = ref(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme.value);
    localStorage.setItem("theme", theme.value);

    // Анимация переключения
    document.body.style.opacity = "0.7";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  };

  onMounted(() => {
    // Проверяем системную тему
    if (!localStorage.getItem("theme")) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        theme.value = "dark";
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    } else {
      document.documentElement.setAttribute("data-theme", theme.value);
    }
  });

  return {
    theme,
    toggleTheme
  };
}
