// ===============================
// 🔹 TROCAR ABAS
// ===============================
function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab");
  const buttons = document.querySelectorAll(".nav button");

  tabs.forEach(tab => tab.classList.remove("active"));
  buttons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");

  event.target.classList.add("active");
}

// ===============================
// 🔹 DADOS
// ===============================
let games = JSON.parse(localStorage.getItem("games")) || [];
let user = JSON.parse(localStorage.getItem("user")) || null;

const form = document.getElementById("gameForm");
const gamesList = document.getElementById("gamesList");
const loginForm = document.getElementById("loginForm");
const userInfo = document.getElementById("userInfo");

// ===============================
// 🔹 ÍCONE POR ESPORTE
// ===============================
function getSportIcon(sport) {
  sport = sport.toLowerCase();

  if (sport.includes("fut")) return "⚽";
  if (sport.includes("volei") || sport.includes("vôlei")) return "🏐";
  if (sport.includes("basquete")) return "🏀";
  if (sport.includes("tenis") || sport.includes("tênis")) return "🎾";

  return "🏅";
}

// ===============================
// 🔹 USUÁRIO
// ===============================
function renderUser() {
  if (!userInfo) return;

  if (user) {
    userInfo.innerHTML = `
      Logado como: <strong>${user.name}</strong>
      <br><br>
      <button onclick="logout()" class="btn">Sair</button>
    `;
  } else {
    userInfo.innerHTML = "Você não está logado.";
  }
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("username").value;

    user = { name };
    localStorage.setItem("user", JSON.stringify(user));

    renderUser();
    alert("Login realizado!");
  });
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  user = null;
  renderUser();
  alert("Você saiu da conta!");
}

// ===============================
// 🔹 RENDERIZAR JOGOS
// ===============================
function renderGames(filtered = games) {
  if (!gamesList) return;

  gamesList.innerHTML = "";

  if (filtered.length === 0) {
    gamesList.innerHTML = "<p>Nenhuma partida encontrada 😢</p>";
    return;
  }

  filtered.forEach((game, index) => {
    const card = document.createElement("div");
    card.classList.add("game-card");

    if (game.players === 0) {
      card.classList.add("full");
    }

    card.innerHTML = `
      <h3>${getSportIcon(game.sport)} ${game.sport}</h3>
      <p>📍 ${game.location}</p>
      <p>⏰ ${new Date(game.date).toLocaleString()}</p>
      <p>👥 ${
        game.players > 0
          ? `Faltam ${game.players} jogador(es)`
          : "Lotado 🚫"
      }</p>
      <p>👤 Criado por: ${game.creator || "Desconhecido"}</p>

      <button 
        class="enter-btn"
        onclick="joinGame(${index})"
        ${game.players === 0 ? "disabled" : ""}
      >
        ${game.players > 0 ? "Entrar no jogo" : "Lotado"}
      </button>
    `;

    gamesList.appendChild(card);
  });
}

// ===============================
// 🔹 CRIAR JOGO
// ===============================
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado!");
      showTab("account");
      return;
    }

    const newGame = {
      sport: document.getElementById("sport").value,
      location: document.getElementById("location").value,
      date: document.getElementById("date").value,
      players: parseInt(document.getElementById("players").value),
      creator: user.name
    };

    games.push(newGame);
    localStorage.setItem("games", JSON.stringify(games));

    form.reset();
    showTab("games");
    renderGames();
  });
}

// ===============================
// 🔹 ENTRAR NO JOGO
// ===============================
function joinGame(index) {
  if (!user) {
    alert("Você precisa estar logado!");
    showTab("account");
    return;
  }

  if (games[index].players > 0) {
    games[index].players--;

    localStorage.setItem("games", JSON.stringify(games));

    alert(`Você entrou no jogo de ${games[index].sport}!`);
    renderGames();
  } else {
    alert("Esse jogo já está cheio!");
  }
}

// ===============================
// 🔹 FILTRO POR CATEGORIA
// ===============================
function filterGames(type) {
  showTab("games");

  if (type === "all") {
    renderGames();
    return;
  }

  const filtered = games.filter(game =>
    game.sport.toLowerCase().includes(type)
  );

  renderGames(filtered);
}

// ===============================
// 🔹 INICIALIZAR
// ===============================
renderUser();
renderGames();