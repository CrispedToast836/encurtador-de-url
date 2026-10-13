const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORTA = 3000;

const ARQUIVO = path.join(__dirname, "links.json");

function carregarLinks() {
  if (!fs.existsSync(ARQUIVO)) {
    return {};
  }
  const texto = fs.readFileSync(ARQUIVO, "utf8");
  if (!texto.trim()) {
    return {};
  }
  return JSON.parse(texto);
}

function salvarLinks() {
  fs.writeFileSync(ARQUIVO, JSON.stringify(links, null, 2));
}

const links = carregarLinks();

function gerarCodigo() {
  return Math.random().toString(36).slice(2, 7);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORTA, () => {
  console.log(`O servidor esta em http://localhost:${PORTA}`);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/api/shorten", (req, res) => {
  const url = req.body?.url;

  if (!url) {
    return res.status(400).json({ erro: "O campo 'url' e obrigatorio." });
  }

  let destino;
  try {
    destino = new URL(url);
  } catch {
    return res.status(400).json({ erro: "A url enviada nao e valida" });
  }

  if (destino.protocol !== "http:" && destino.protocol !== "https:") {
    return res.status(400).json({ erro: "Apenas http e https sao aceitos." });
  }

  let codigo = gerarCodigo();
  while (links[codigo]) {
    codigo = gerarCodigo();
  }

  links[codigo] = url;
  salvarLinks();

  res.status(201).json({
    codigo: codigo,
    urlCurta: `http://localhost:${PORTA}/${codigo}`,
    urlOriginal: url,
  });
});

app.get("/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  const destino = links[codigo];

  if (!destino) {
    return res.status(404).json({ erro: "Esse link curto nao existe." });
  }

  res.redirect(302, destino);
});
