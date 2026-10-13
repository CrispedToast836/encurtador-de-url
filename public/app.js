const formulario = document.getElementById("formulario");
const campoUrl = document.getElementById("campo-url");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const resposta = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: campoUrl.value }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    resultado.textContent = dados.erro;
    return;
  }

  resultado.textContent = dados.urlCurta;
});
