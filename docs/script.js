(function () {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  // 初期設定：localStorage > システム設定 > デフォルト
  const savedTheme = localStorage.getItem("documentationTheme");
  if (savedTheme) {
    if (savedTheme === "dark") body.classList.add("dark");
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.classList.add("dark");
  }

  // ボタンの表示切り替え
  function updateButton() {
    btn.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
  }
  updateButton();

  // ボタンクリック時
  btn.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("documentationTheme", body.classList.contains("dark") ? "dark" : "light");
    updateButton();
  });
})();
