const itensDiv = document.getElementById("itens");

function criarItens() {
  for (let i = 0; i < 12; i++) {
    const top = 245 + i * 28;

    const unid = document.createElement("input");
    unid.className = "campo quantidade";
    unid.dataset.index = i;
    unid.style = `top:${top}px; left:34px; width:50px;`;
    unid.addEventListener("blur", calcularValores);

    const preco = document.createElement("input");
    preco.className = "campo preco";
    preco.dataset.index = i;
    preco.style = `top:${top}px; left:96px; width:70px;`;
    preco.addEventListener("blur", calcularValores);

    const desc = document.createElement("input");
    desc.className = "campo desc";
    desc.dataset.index = i;
    desc.style = `top:${top}px; left:184px; width:485px;`;
    desc.addEventListener("blur", calcularValores);

    const valor = document.createElement("input");
    valor.className = "campo readonly valor";
    valor.readOnly = true;
    valor.dataset.index = i;
    valor.style = `top:${top}px; left:780px; width:80px; font-weight: bold;`;
    
    valor.style.backgroundColor = "transparent";

    itensDiv.appendChild(unid);
    itensDiv.appendChild(preco);
    itensDiv.appendChild(desc);
    itensDiv.appendChild(valor);
  }
}

function calcularValores() {
  let total = 0;

  for (let i = 0; i < 12; i++) {
    const unid = document.querySelector(`.quantidade[data-index="${i}"]`).value.trim();
    const preco = document.querySelector(`.preco[data-index="${i}"]`).value.trim()
      .replace("R$", "").replace(/\./g, "").replace(",", ".");
    const valorInput = document.querySelector(`.valor[data-index="${i}"]`);

    if (unid && preco && !isNaN(unid) && !isNaN(preco)) {
      const v = parseInt(unid) * parseFloat(preco);
      valorInput.value = `${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      total += v;
    } else {
      valorInput.value = "";
    }
  }

  document.getElementById("total").value = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  
}

function riscarLinhas() {
  for (let i = 0; i < 12; i++) {
    const desc = document.querySelectorAll(".campo")[i * 4 + 2]; // índice do campo Discriminação
    if (desc && desc.value.trim() === "") {
      // Adiciona uma linha horizontal com CSS (pelo border)
      desc.style.borderBottom = "1px solid black";
    } else {
      // Remove qualquer traço anterior, se houver
      desc.style.borderBottom = "1px solid #ccc";
    }
  }
}

function gerarImagem() {
  const form = document.querySelector(".form-container");
  const botoes = document.querySelector(".botoes");

  document.getElementById("opcoes").style.display = "block";
  riscarLinhas(); // desenha o traço visivelmente

  botoes.style.display = "none"; // esconde botões da captura

  setTimeout(() => {
    html2canvas(form, {
      useCORS: true,
      backgroundColor: null,
      scale: 2
    }).then(canvas => {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        window.generatedImageURL = url;
        window.generatedImageBlob = blob;
        incrementarPedido();
        botoes.style.display = "block"; // volta com os botões
      });
    });
  }, 50);
}

function baixarImagem() {
  if (window.generatedImageURL) {
    const a = document.createElement("a");
    a.href = window.generatedImageURL;
    a.download = "formulario_heltec.png";
    a.click();
  }
}

function compartilharWhatsApp() {
  if (window.generatedImageURL) {
    alert("A imagem será aberta em uma nova aba. Você poderá salvá-la e anexar no WhatsApp manualmente.");
    window.open(window.generatedImageURL, "_blank");
    setTimeout(() => {
      window.open("https://web.whatsapp.com/", "_blank");
    }, 1000);
  } else {
    alert("Gere o pedido primeiro antes de enviar via WhatsApp.");
  }
}

function preencherDataAtual() {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');
  document.getElementById("data").value = dataFormatada;
}

function inicializarPedido() {
  let numero = parseInt(localStorage.getItem("numeroPedido") || "1");
  document.getElementById("pedido").value = numero.toString().padStart(4, "0");
}

function incrementarPedido() {
  let numero = parseInt(localStorage.getItem("numeroPedido") || "1");
  numero++;
  localStorage.setItem("numeroPedido", numero);
  document.getElementById("pedido").value = numero.toString().padStart(4, "0");
}

window.onload = () => {
  criarItens();
  preencherDataAtual();
  inicializarPedido();
  
};
