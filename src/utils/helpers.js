// Форматирование даты
export const formatDate = (date, format = "short") => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (format === "short") {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } else if (format === "full") {
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } else if (format === "time") {
    return date.toLocaleDateString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return date.toLocaleDateString("ru-RU");
};

// Форматирование времени в человекочитаемом виде
export const formatTime = (hours) => {
  if (hours < 1) {
    return "менее часа";
  } else if (hours < 24) {
    return `${Math.round(hours)}ч`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}д ${Math.round(remainingHours)}ч`;
  }
};

// Генерация уникального ID
export const generateId = (prefix = "") => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Клонирование объекта
export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Дебаунс для оптимизации событий
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Троттлинг для оптимизации событий
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Проверка на мобильное устройство
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Проверка на тач-устройство
export const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Копирование текста в буфер обмена
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("✅ Текст скопирован в буфер обмена");
    return true;
  } catch (err) {
    console.error("❌ Ошибка копирования:", err);
    return false;
  }
};
