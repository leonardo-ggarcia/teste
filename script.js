document.addEventListener("DOMContentLoaded", () => {
  const qrContainer = document.getElementById("qrcode");
  const qrNotice = document.getElementById("qr-notice");
  const modelViewer = document.getElementById("product-viewer");
  const progressBar = document.getElementById("progress-bar");
  const errorMessage = document.getElementById("error-message");

  // 1. OBTENÇÃO DA URL ATUAL DA PÁGINA
  const currentUrl = window.location.href;
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Verifica se o site está rodando localmente (no computador do desenvolvedor)
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "" ||
    protocol === "file:";

  // 2. LÓGICA DO QR CODE
  if (isLocal) {
    // Alerta o usuário de que a página precisa ser publicada na internet para funcionar em outros aparelhos
    qrNotice.classList.remove("hidden");
    qrNotice.classList.add("warning");
    qrNotice.innerHTML = `
      <strong>💡 Nota para ambiente de desenvolvimento local:</strong><br>
      Você está acessando via endereço local (<code>${hostname || "arquivo local"}</code>).<br>
      O QR Code abaixo apontará para este endereço. Para que <strong>outro celular</strong> consiga abrir a página e ver o produto em Realidade Aumentada, é necessário publicar esta pasta em um site na internet (ex: Netlify ou GitHub Pages).
    `;
  }

  // Gera o QR Code com a URL atual
  try {
    new QRCode(qrContainer, {
      text: currentUrl,
      width: 160,
      height: 160,
      colorDark: "#0f172a",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
  }

  // 3. BARRA DE PROGRESSO DE CARREGAMENTO DO MODELO 3D
  modelViewer.addEventListener("progress", (event) => {
    const percentage = event.detail.totalProgress * 100;
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      if (percentage === 100) {
        setTimeout(() => {
          progressBar.style.width = "0%";
        }, 500);
      }
    }
  });

  // 4. TRATAMENTO DE ERRO CASO PRODUTO.GLB NÃO SEJA ENCONTRADO
  modelViewer.addEventListener("error", (event) => {
    console.error("Erro no carregamento do arquivo PRODUTO.glb:", event);
    if (errorMessage) {
      errorMessage.classList.remove("hidden");
    }
  });
});