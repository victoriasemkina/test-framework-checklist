import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function useExport(items, completedItems, score, currentLevel) {
  const exportResults = () => {
    const exportType = showExportDialog();
    if (!exportType) return;

    if (exportType === "json") {
      exportToJson();
    } else if (exportType === "pdf") {
      exportToPdf();
    } else if (exportType === "html") {
      exportToHtml();
    }
  };

  const showExportDialog = () => {
    const type = prompt(
      "Выберите формат экспорта:\n" +
        "• pdf - Красивый отчёт в PDF (рекомендуется)\n" +
        "• json - Данные в формате JSON\n" +
        "• html - HTML отчёт для просмотра в браузере",
      "pdf"
    );

    if (!type) return null;
    const normalized = type.toLowerCase().trim();
    if (["pdf", "json", "html"].includes(normalized)) {
      return normalized;
    }
    alert("Неверный формат. Доступны: pdf, json, html");
    return showExportDialog();
  };

  const exportToJson = () => {
    const results = {
      timestamp: new Date().toISOString(),
      completedCount: completedItems.value.size,
      totalCount: items.value.length,
      completionPercent: score.value,
      maturityLevel: currentLevel.value.label,
      completedItems: Array.from(completedItems.value).map((id) => {
        const item = items.value.find((i) => i.id === id);
        return {
          id: item.id,
          text: item.text,
          category: item.categoryName,
          priority: item.priority,
          timeToFix: item.timeToFix
        };
      }),
      pendingItems: items.value
        .filter((item) => !completedItems.value.has(item.id))
        .map((item) => ({
          id: item.id,
          text: item.text,
          category: item.categoryName,
          priority: item.priority,
          timeToFix: item.timeToFix
        }))
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `test-framework-checklist-${getFormattedDate()}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    alert("✅ Результаты экспортированы в JSON!");
  };

  const exportToPdf = () => {
    alert("⏳ Генерация PDF отчёта...\nЭто может занять 10-20 секунд.");

    // Создаём временный элемент для рендеринга отчёта
    const reportElement = createReportElement();
    document.body.appendChild(reportElement);

    setTimeout(() => {
      html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const imgWidth = pageWidth - 20;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          const pagesCount = Math.ceil(imgHeight / (pageHeight - 20));

          for (let i = 0; i < pagesCount; i++) {
            const yPos = -(i * (pageHeight - 20));
            pdf.addImage(imgData, "PNG", 10, yPos, imgWidth, imgHeight);

            if (i < pagesCount - 1) {
              pdf.addPage();
            }
          }

          pdf.save(`test-framework-checklist-${getFormattedDate()}.pdf`);

          // Удаляем временный элемент
          document.body.removeChild(reportElement);

          alert("✅ PDF отчёт успешно сгенерирован и скачан!");
        })
        .catch((error) => {
          console.error("Ошибка генерации PDF:", error);
          alert("❌ Ошибка при генерации PDF. Попробуйте ещё раз.");
          document.body.removeChild(reportElement);
        });
    }, 100);
  };

  const createReportElement = () => {
    const remainingTime = items.value.reduce((total, item) => {
      return completedItems.value.has(item.id) ? total : total + item.timeToFix;
    }, 0);

    const categories = {};
    items.value.forEach((item) => {
      if (!categories[item.categoryId]) {
        categories[item.categoryId] = {
          name: item.categoryName,
          completed: 0,
          total: 0
        };
      }
      categories[item.categoryId].total++;
      if (completedItems.value.has(item.id)) {
        categories[item.categoryId].completed++;
      }
    });

    const div = document.createElement("div");
    div.style.width = "210mm";
    div.style.minHeight = "297mm";
    div.style.padding = "30mm 25mm";
    div.style.background = "white";
    div.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    div.style.color = "#333";
    div.style.lineHeight = "1.6";
    div.style.boxShadow = "0 0 20px rgba(0,0,0,0.1)";

    div.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 2rem;">
          <i class="fas fa-clipboard-check"></i>
        </div>
        <h1 style="font-size: 28px; color: #1f2937; margin-bottom: 10px; font-weight: 700;">Test Framework Checklist</h1>
        <p style="font-size: 16px; color: #6b7280; margin-bottom: 15px;">Отчёт об оценке зрелости тестового фреймворка</p>
        <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Дата генерации: ${new Date().toLocaleDateString(
          "ru-RU",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }
        )}</div>
      </div>
      
      <div style="background: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 30px; margin-bottom: 20px;">
          <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#10b981 ${
            score.value * 3.6
          }deg, #d1d5db ${
      score.value * 3.6
    }deg, #d1d5db 360deg); display: flex; align-items: center; justify-content: center; position: relative; margin: 0 auto;">
            <div style="position: absolute; width: 90px; height: 90px; background: white; border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1; text-align: center;">
              <span style="font-size: 32px; font-weight: 800; color: #6366f1;">${
                score.value
              }</span>
              <span style="font-size: 18px; color: #6b7280;">%</span>
            </div>
          </div>
          <div style="text-align: center; flex: 1; min-width: 200px;">
            <h3 style="font-size: 18px; color: #4b5563; margin-bottom: 10px; font-weight: 600;">Уровень зрелости</h3>
            <div style="display: inline-flex; align-items: center; gap: 10px; padding: 10px 24px; background: linear-gradient(135deg, ${
              currentLevel.value.color
            }88 0%, ${
      currentLevel.value.color
    }cc 100%); color: white; border-radius: 20px; font-size: 20px; font-weight: 700; margin: 0 auto;">
              <span style="font-size: 24px;">${currentLevel.value.emoji}</span>
              <span>${currentLevel.value.label}</span>
            </div>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-around; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <div style="text-align: center;">
            <span style="font-size: 28px; font-weight: 700; color: #1f2937; display: block; margin-bottom: 5px;">${
              completedItems.value.size
            }</span>
            <span style="font-size: 14px; color: #6b7280; display: block;">Выполнено</span>
          </div>
          <div style="text-align: center;">
            <span style="font-size: 28px; font-weight: 700; color: #1f2937; display: block; margin-bottom: 5px;">${
              items.value.length
            }</span>
            <span style="font-size: 14px; color: #6b7280; display: block;">Всего</span>
          </div>
          <div style="text-align: center;">
            <span style="font-size: 28px; font-weight: 700; color: #1f2937; display: block; margin-bottom: 5px;">${remainingTime}</span>
            <span style="font-size: 14px; color: #6b7280; display: block;">часов до идеала</span>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        ${Object.entries(categories)
          .map(
            ([id, cat]) => `
          <div style="margin-bottom: 25px; page-break-inside: avoid;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; margin-bottom: 0;">
              <h2 style="font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-folder"></i>
                ${cat.name}
                <span style="font-size: 14px; margin-left: 10px;">(${
                  cat.completed
                }/${cat.total})</span>
              </h2>
            </div>
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 0 0 8px 8px; padding: 20px;">
              ${items.value
                .filter((item) => item.categoryId === id)
                .map((item) => {
                  const isChecked = completedItems.value.has(item.id);
                  const priority = {
                    critical: { label: "Критичный", color: "#ef4444" },
                    high: { label: "Высокий", color: "#f59e0b" },
                    medium: { label: "Средний", color: "#3b82f6" },
                    low: { label: "Низкий", color: "#6b7280" }
                  }[item.priority];
                  return `
                    <div style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start; gap: 12px;">
                      <div style="width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; background: ${
                        isChecked ? "#10b981" : "#d1d5db"
                      }; color: white;">
                        ${
                          isChecked
                            ? '<i class="fas fa-check" style="font-size: 10px;"></i>'
                            : ""
                        }
                      </div>
                      <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 14px; color: #374151; margin-bottom: 4px; line-height: 1.5; ${
                          isChecked
                            ? "text-decoration: line-through; color: #9ca3af;"
                            : ""
                        }">${item.text}</div>
                        <div style="display: flex; align-items: center; gap: 15px; font-size: 12px; color: #6b7280;">
                          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; background: rgba(${
                            priority.color === "#ef4444"
                              ? "239, 68, 68"
                              : priority.color === "#f59e0b"
                              ? "245, 158, 11"
                              : priority.color === "#3b82f6"
                              ? "59, 130, 246"
                              : "107, 114, 128"
                          }, 0.15); color: ${priority.color};">
                            <i class="fas fa-flag"></i> ${priority.label}
                          </span>
                          <span style="display: flex; align-items: center; gap: 4px;">
                            <i class="fas fa-clock"></i> ~${item.timeToFix}ч
                          </span>
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div style="text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 13px;">
        <p style="margin: 5px 0;">Сгенерировано с помощью <strong>Test Framework Checklist</strong></p>
        <p style="margin: 5px 0;">Дата: ${new Date().toLocaleDateString(
          "ru-RU"
        )}</p>
      </div>
    `;

    return div;
  };

  const exportToHtml = () => {
    const reportElement = createReportElement();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Framework Checklist - Отчёт</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: white; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        </style>
      </head>
      <body>
        ${reportElement.outerHTML}
      </body>
      </html>
    `;

    const dataStr =
      "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent);
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `test-framework-checklist-report-${getFormattedDate()}.html`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    alert("✅ HTML отчёт успешно сгенерирован и скачан!");
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

  return {
    exportResults
  };
}
