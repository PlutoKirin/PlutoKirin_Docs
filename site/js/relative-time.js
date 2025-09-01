document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".date-modified");

    elements.forEach(el => {
        const isoDate = el.getAttribute("data-time");
        if (!isoDate) return;

        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now - date;

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        let text;
        if (diffMinutes < 60) {
            text = `${diffMinutes} 分钟前`;
        } else if (diffHours < 24) {
            text = `${diffHours} 小时前`;
        } else if (diffDays < 30) {
            text = `${diffDays} 天前`;
        } else {
            text = date.toLocaleDateString("zh-CN");
        }

        // 显示相对时间
        el.textContent = text;

        // 鼠标悬停时显示完整时间（精确到小时分钟）
        el.title = date.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    });
});
