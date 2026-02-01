import { onMounted, ref } from "vue";

export function useHistory() {
  const history = ref(
    JSON.parse(localStorage.getItem("checklist_history")) || []
  );

  const addHistoryEntry = (percent, completed, total) => {
    const lastEntry =
      history.value.length > 0 ? history.value[history.value.length - 1] : null;

    // Добавляем запись только если процент изменился
    if (!lastEntry || lastEntry.percent !== percent) {
      const entry = {
        date: new Date().toISOString(),
        percent,
        completed,
        total
      };

      history.value.push(entry);
      saveToLocalStorage();
      console.log("📝 Добавлена запись в историю:", entry);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("checklist_history", JSON.stringify(history.value));
  };

  const exportHistoryCsv = () => {
    if (history.value.length === 0) {
      alert("Нет данных для экспорта");
      return;
    }

    // Заголовки
    const headers = ["Дата", "Зрелость (%)", "Выполнено", "Всего"];

    // Данные
    const rows = history.value.map((entry) => {
      const date = new Date(entry.date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      return [date, entry.percent, entry.completed, entry.total];
    });

    // Формируем CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    // Скачиваем файл
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute(
      "download",
      `progress-history-${getFormattedDate()}.csv`
    );
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    alert("✅ История экспортирована в CSV!");
  };

  const getFormattedDate = () => {
    const date = new Date();
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(date.getDate()).padStart(2, "0")}_${String(
      date.getHours()
    ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
  };

  onMounted(() => {
    console.log("📊 История загружена:", history.value.length, "записей");
  });

  return {
    history,
    addHistoryEntry,
    exportHistoryCsv
  };
}
