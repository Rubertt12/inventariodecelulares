let registros = [];
let filtroAtual = [];
let generatedPdfIds = []; // NOVO: Armazena os IDs que vieram da página principal
let processedBatchHashes = []; // Armazena os hashes dos lotes já processados
let currentBatchHash = null;   // Armazena o hash do lote atual
let templateSettings = null;
let defaultTemplateSettings = null;
let templateSaveTimer = null;
 
const ids = [
  "fTicket","fNome","fMatricula","fCC","fLocalidade",
  "fModelo","fImei","fImei2","fSerie","fLinha","fChip","fCidade","fData"
];

function limparFormulario() {
  ids.forEach(id => document.getElementById(id).value = "");
  document.getElementById("cCartaoPuk").checked = false;
  atualizarTermo();
}

function abrirModo(modo) {
  document.getElementById("modoIndividual").classList.toggle("hidden", modo !== "individual");
  document.getElementById("modoLote").classList.toggle("hidden", modo !== "lote");
  document.getElementById("modoModelo").classList.toggle("hidden", modo !== "modelo");
  document.getElementById("tabIndividual").classList.toggle("active", modo === "individual");
  document.getElementById("tabLote").classList.toggle("active", modo === "lote");
  document.getElementById("tabModelo").classList.toggle("active", modo === "modelo");
}

function hojePorExtenso() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());
}

document.getElementById("fData").value = hojePorExtenso();

const TEMPLATE_STORAGE_KEY = "termTemplateSettingsV2";
const TEMPLATE_TEXT_DEFAULTS = {
  headerText: "",
  title: "TERMO DE RESPONSABILIDADE DE CELULAR",
  ticketLabel: "Ticket",
  intro: "Pelo presente instrumento, a organização responsável pela disponibilização dos recursos de tecnologia entrega ao colaborador descrito abaixo o aparelho celular corporativo:",
  collaboratorTitle: "DADOS DO COLABORADOR",
  labelName: "Nome",
  labelMatricula: "Matrícula",
  labelLocal: "Localidade",
  labelCC: "Centro de Custo",
  deviceTitle: "DADOS DO APARELHO",
  labelDeviceType: "Tipo de aparelho",
  deviceType: "SmartPhone",
  labelImei1: "IMEI 1",
  labelImei2: "IMEI 2",
  labelSerial: "S/N",
  labelLine: "Linha",
  labelChip: "CHIP",
  labelModel: "Marca e Modelo",
  accessoryIntro: "Acompanham este aparelho os itens assinalados abaixo:",
  accessoryCharger: "Carregador",
  accessoryHeadphones: "Fone de ouvido",
  accessoryAdapter: "Adaptador USB",
  rulesIntro: "O uso do aparelho possui tais restrições:",
  rules: [
    "Não pode ser utilizado para outro fim comercial que não o exercício das atividades laborais do funcionário, nos termos do seu contrato de trabalho;",
    "Nos casos de dano, perda, furto e demais sinistros durante o período, o equipamento será de total responsabilidade do usuário;",
    "A T.I. não se responsabilizará por nenhum tipo de informação deixada no aparelho;",
    "Não deve ser repassado internamente sem o conhecimento da T.I;",
    "Em caso de desligamento ou encerramento da necessidade de uso, a linha, o aparelho e seus acessórios devem ser devolvidos ao setor responsável, em perfeitas condições de uso;",
    "Ao assinar este, o colaborador assume que leu e está ciente da “NORMA DE UTILIZAÇÃO DO SERVIÇO DE TELEFONIA MÓVEL”."
  ],
  renewalRule: "Aparelho não está sujeito a política de troca por vencimento;",
  pukText: " (cartão com a senha PUK entregue ao usuário)",
  datePrefix: "",
  dateSeparator: ", ",
  dateSuffix: ".",
  signature: "Assinatura do Funcionário:",
  footerText: ""
};

const TEMPLATE_EDITOR_FIELDS = [
  ["templateHeaderText", "headerText"],
  ["templateTitle", "title"],
  ["templateTicketLabel", "ticketLabel"],
  ["templateIntro", "intro"],
  ["templateCollaboratorTitle", "collaboratorTitle"],
  ["templateLabelName", "labelName"],
  ["templateLabelMatricula", "labelMatricula"],
  ["templateLabelLocal", "labelLocal"],
  ["templateLabelCC", "labelCC"],
  ["templateDeviceTitle", "deviceTitle"],
  ["templateLabelDeviceType", "labelDeviceType"],
  ["templateDeviceType", "deviceType"],
  ["templateLabelImei1", "labelImei1"],
  ["templateLabelImei2", "labelImei2"],
  ["templateLabelSerial", "labelSerial"],
  ["templateLabelLine", "labelLine"],
  ["templateLabelChip", "labelChip"],
  ["templateLabelModel", "labelModel"],
  ["templateAccessoryIntro", "accessoryIntro"],
  ["templateAccessoryCharger", "accessoryCharger"],
  ["templateAccessoryHeadphones", "accessoryHeadphones"],
  ["templateAccessoryAdapter", "accessoryAdapter"],
  ["templateRulesIntro", "rulesIntro"],
  ["templateRenewalRule", "renewalRule"],
  ["templatePukText", "pukText"],
  ["templateDatePrefix", "datePrefix"],
  ["templateDateSeparator", "dateSeparator"],
  ["templateDateSuffix", "dateSuffix"],
  ["templateSignature", "signature"],
  ["templateFooterText", "footerText"]
];

function createDefaultTemplateSettings() {
  return {
    ...TEMPLATE_TEXT_DEFAULTS,
    headerLogo: document.querySelector(".header img")?.getAttribute("src") || "",
    footerLogo: document.querySelector(".footer img")?.getAttribute("src") || ""
  };
}

function cloneDefaultTemplateSettings() {
  return JSON.parse(JSON.stringify(defaultTemplateSettings));
}

function loadTemplateSettings() {
  const defaults = cloneDefaultTemplateSettings();
  try {
    const saved = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY) || "{}");
    const cleaned = {
      ...defaults,
      ...saved,
      // O termo não deve reaplicar identidade visual ou endereço de uma empresa cliente.
      headerText: "",
      headerLogo: "",
      footerText: "",
      footerLogo: "",
      rules: Array.isArray(saved.rules) ? saved.rules : defaults.rules
    };
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch (error) {
    console.error("Não foi possível carregar o modelo salvo:", error);
    return { ...defaults, headerText: "", headerLogo: "", footerText: "", footerLogo: "" };
  }
}

function setLogoPreview(image, source) {
  if (!image) return;
  if (source) {
    image.src = source;
    image.hidden = false;
  } else {
    image.removeAttribute("src");
    image.hidden = true;
  }
}

function setTemplateLabel(listItem, text) {
  const label = listItem?.querySelector("strong");
  if (label) label.textContent = `${text}:`;
}

function applyTemplateSettings() {
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  setText(".title", templateSettings.title);
  const ticket = document.querySelector(".ticket");
  if (ticket?.firstChild) ticket.firstChild.textContent = `${templateSettings.ticketLabel}: `;
  setText(".intro", templateSettings.intro);

  const header = document.querySelector(".header");
  const headerImage = header.querySelector("img");
  let headerCopy = header.querySelector(".template-header-copy");
  if (!headerCopy) {
    headerCopy = document.createElement("div");
    headerCopy.className = "template-copy template-header-copy";
    header.insertBefore(headerCopy, headerImage);
  }
  headerCopy.textContent = templateSettings.headerText;
  setLogoPreview(headerImage, templateSettings.headerLogo);

  const footer = document.querySelector(".footer");
  const footerImage = footer.querySelector("img");
  let footerCopy = footer.querySelector(".template-footer-copy");
  if (!footerCopy) {
    footerCopy = document.createElement("div");
    footerCopy.className = "template-copy template-footer-copy";
    footer.insertBefore(footerCopy, footerImage);
  }
  footerCopy.textContent = templateSettings.footerText;
  setLogoPreview(footerImage, templateSettings.footerLogo);

  document.querySelectorAll(".section-title")[0].textContent = `${templateSettings.collaboratorTitle}:`;
  document.querySelectorAll(".section-title")[1].textContent = `${templateSettings.deviceTitle}:`;
  const lists = document.querySelectorAll(".data-list");
  [templateSettings.labelName, templateSettings.labelMatricula, templateSettings.labelLocal, templateSettings.labelCC]
    .forEach((label, index) => setTemplateLabel(lists[0].children[index], label));

  const deviceLabels = [
    templateSettings.labelDeviceType,
    templateSettings.labelImei1,
    templateSettings.labelImei2,
    templateSettings.labelSerial,
    templateSettings.labelLine,
    templateSettings.labelChip,
    templateSettings.labelModel
  ];
  deviceLabels.forEach((label, index) => setTemplateLabel(lists[1].children[index], label));
  const deviceTypeItem = lists[1].children[0];
  const deviceTypeValue = Array.from(deviceTypeItem.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
  if (deviceTypeValue) deviceTypeValue.nodeValue = ` ${templateSettings.deviceType}`;

  const accessories = document.querySelector(".accessories");
  const marks = ["vCarregador", "vFone", "vUsb"].map(id => document.getElementById(id));
  const markValues = marks.map(mark => mark.textContent);
  accessories.replaceChildren(
    document.createTextNode("("), marks[0], document.createTextNode(`) ${templateSettings.accessoryCharger}   (`),
    marks[1], document.createTextNode(`) ${templateSettings.accessoryHeadphones}   (`),
    marks[2], document.createTextNode(`) ${templateSettings.accessoryAdapter}`)
  );
  accessories.previousElementSibling.textContent = templateSettings.accessoryIntro;
  const rulesList = document.querySelector(".rules");
  rulesList.previousElementSibling.textContent = templateSettings.rulesIntro;
  const ruleTexts = templateSettings.rules.filter(rule => String(rule).trim());
  const renewalIndex = Math.min(5, ruleTexts.length);
  const ruleItems = ruleTexts.slice(0, renewalIndex).map(text => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  });
  if (templateSettings.renewalRule.trim()) {
    const renewalItem = document.createElement("li");
    renewalItem.id = "regraVencimento";
    renewalItem.textContent = templateSettings.renewalRule;
    ruleItems.push(renewalItem);
  }
  ruleItems.push(...ruleTexts.slice(renewalIndex).map(text => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
  rulesList.replaceChildren(...ruleItems);

  const dateLine = document.querySelector(".date-line");
  const city = document.getElementById("vCidade");
  const date = document.getElementById("vData");
  dateLine.replaceChildren(
    document.createTextNode(templateSettings.datePrefix),
    city,
    document.createTextNode(templateSettings.dateSeparator),
    date,
    document.createTextNode(templateSettings.dateSuffix)
  );
  setText(".signature", templateSettings.signature);

  setLogoPreview(document.getElementById("templateHeaderLogoPreview"), templateSettings.headerLogo);
  setLogoPreview(document.getElementById("templateFooterLogoPreview"), templateSettings.footerLogo);
  atualizarTermo();
}

function persistTemplateSettings() {
  clearTimeout(templateSaveTimer);
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templateSettings));
    document.getElementById("templateSaveStatus").textContent = "Modelo salvo neste computador.";
  } catch (error) {
    console.error("Não foi possível salvar o modelo:", error);
    document.getElementById("templateSaveStatus").textContent = "Não foi possível salvar. Reduza o tamanho dos logos.";
  }
}

function scheduleTemplateSave() {
  const status = document.getElementById("templateSaveStatus");
  status.textContent = "Salvando alterações...";
  clearTimeout(templateSaveTimer);
  templateSaveTimer = setTimeout(persistTemplateSettings, 250);
}

function bindTemplateLogo(inputId, settingKey, previewId, removeButtonId) {
  const input = document.getElementById(inputId);
  input.addEventListener("change", () => {
    const file = input.files[0];
    input.value = "";
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      document.getElementById("templateSaveStatus").textContent = "Use PNG, JPG ou WebP de até 2 MB.";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      templateSettings[settingKey] = String(reader.result || "");
      setLogoPreview(document.getElementById(previewId), templateSettings[settingKey]);
      applyTemplateSettings();
      persistTemplateSettings();
    };
    reader.onerror = () => {
      document.getElementById("templateSaveStatus").textContent = "Não foi possível ler esse arquivo de imagem.";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById(removeButtonId).addEventListener("click", () => {
    templateSettings[settingKey] = "";
    applyTemplateSettings();
    persistTemplateSettings();
  });
}

function setupTemplateEditor() {
  defaultTemplateSettings = createDefaultTemplateSettings();
  templateSettings = loadTemplateSettings();

  TEMPLATE_EDITOR_FIELDS.forEach(([elementId, settingKey]) => {
    const input = document.getElementById(elementId);
    input.value = templateSettings[settingKey];
    input.addEventListener("input", () => {
      templateSettings[settingKey] = input.value;
      applyTemplateSettings();
      scheduleTemplateSave();
    });
  });

  const rulesInput = document.getElementById("templateRules");
  rulesInput.value = templateSettings.rules.join("\n");
  rulesInput.addEventListener("input", () => {
    templateSettings.rules = rulesInput.value.split(/\r?\n/).map(rule => rule.trim()).filter(Boolean);
    applyTemplateSettings();
    scheduleTemplateSave();
  });

  bindTemplateLogo("templateHeaderLogoFile", "headerLogo", "templateHeaderLogoPreview", "btnRemoveHeaderLogo");
  bindTemplateLogo("templateFooterLogoFile", "footerLogo", "templateFooterLogoPreview", "btnRemoveFooterLogo");
  document.getElementById("btnResetTemplate").addEventListener("click", () => {
    templateSettings = cloneDefaultTemplateSettings();
    localStorage.removeItem(TEMPLATE_STORAGE_KEY);
    setupTemplateEditorFields();
    applyTemplateSettings();
    document.getElementById("templateSaveStatus").textContent = "Modelo original restaurado.";
  });
  applyTemplateSettings();
}

function setupTemplateEditorFields() {
  TEMPLATE_EDITOR_FIELDS.forEach(([elementId, settingKey]) => {
    document.getElementById(elementId).value = templateSettings[settingKey];
  });
  document.getElementById("templateRules").value = templateSettings.rules.join("\n");
}

window.addEventListener("beforeunload", persistTemplateSettings);
setupTemplateEditor();

function atualizarTermo() {
  try { // Adicionado try-catch para depuração
    document.getElementById("vTicket").textContent = document.getElementById("fTicket").value;
    document.getElementById("vNome").textContent = document.getElementById("fNome").value;
    document.getElementById("vMatricula").textContent = document.getElementById("fMatricula").value;
    document.getElementById("vCC").textContent = document.getElementById("fCC").value;
    document.getElementById("vLocalidade").textContent = document.getElementById("fLocalidade").value;
    document.getElementById("vModelo").textContent = document.getElementById("fModelo").value; // This should now be correct
    document.getElementById("vImei").textContent = document.getElementById("fImei").value;
  document.getElementById("vImei2").textContent = document.getElementById("fImei2").value;
  document.getElementById("vSerie").textContent = document.getElementById("fSerie").value;
  document.getElementById("vLinha").textContent = document.getElementById("fLinha").value;
  document.getElementById("vChip").textContent = document.getElementById("fChip").value;
  document.getElementById("vCartaoPuk").textContent =
    document.getElementById("cCartaoPuk").checked ? templateSettings.pukText : "";
  document.getElementById("vCidade").textContent = document.getElementById("fCidade").value;
  document.getElementById("vData").textContent = document.getElementById("fData").value;

  document.getElementById("linhaImei2").style.display =
    document.getElementById("fImei2").value.trim() ? "list-item" : "none";

  document.getElementById("linhaTelefone").style.display =
    document.getElementById("fLinha").value.trim() ? "list-item" : "none";

  document.getElementById("linhaChip").style.display =
    document.getElementById("fChip").value.trim() ? "list-item" : "none";

  const modeloTermo = document.getElementById("fModeloTermo").value;
  const renewalRule = document.getElementById("regraVencimento");
  if (renewalRule) {
    renewalRule.style.display = (modeloTermo === "A07" || modeloTermo === "A06") ? "list-item" : "none";
  }

  document.getElementById("vCarregador").textContent =
    document.getElementById("cCarregador").checked ? "X" : " ";

  document.getElementById("vFone").textContent =
    document.getElementById("cFone").checked ? "X" : " ";

    document.getElementById("vUsb").textContent =
      document.getElementById("cUsb").checked ? "X" : " ";
  } catch (error) {
    console.error("Erro ao atualizar o termo:", error);
    mostrarStatus("Erro ao atualizar o termo. Verifique o console para detalhes.");
  }
}

ids.forEach(id => document.getElementById(id).addEventListener("input", atualizarTermo));
document.getElementById("fModeloTermo").addEventListener("change", function() {
  // REMOVIDO: Não sobrescrever fModelo aqui. fModelo é preenchido diretamente do registro.
  // const modelos = { A56: "Samsung Galaxy A56", iPhone: "iPhone", A07: "Samsung Galaxy A07", A06: "Samsung Galaxy A06" };
  // document.getElementById("fModelo").value = modelos[this.value] || "Samsung Galaxy A56";
  
  // Regra específica para iPhone: desmarca o carregador
  document.getElementById("cCarregador").checked = (this.value !== "iPhone");
  atualizarTermo();
});
["cCarregador","cFone","cUsb","cCartaoPuk"].forEach(id =>
  document.getElementById(id).addEventListener("change", atualizarTermo)
);

// NOVO: Adiciona um listener para o campo de modelo do telefone.
// Isso garante que, ao digitar o modelo, o "Modelo do Termo" correto seja selecionado,
// ativando as regras de negócio associadas (como a regra de vencimento).
document.getElementById("fModelo").addEventListener("input", function() {
    const modeloValue = this.value.toLowerCase();
    const modeloTermoSelect = document.getElementById("fModeloTermo");
    let newModeloTermo = "A56"; // Padrão

    if (modeloValue.includes("iphone")) {
        newModeloTermo = "iPhone";
    } else if (modeloValue.includes("a07")) {
        newModeloTermo = "A07";
    } else if (modeloValue.includes("a06")) {
        newModeloTermo = "A06";
    }
    
    // Só atualiza e dispara o evento se o valor realmente mudar
    if (modeloTermoSelect.value !== newModeloTermo) {
        modeloTermoSelect.value = newModeloTermo;
        // Dispara o evento 'change' para que a lógica associada (desmarcar carregador, atualizar regra de vencimento) seja executada.
        modeloTermoSelect.dispatchEvent(new Event('change'));
    }
});

function dadosFormulario() {
  return {
    modeloTermo: document.getElementById("fModeloTermo").value,
    ticket: document.getElementById("fTicket").value.trim(),
    nome: document.getElementById("fNome").value.trim(),
    matricula: document.getElementById("fMatricula").value.trim(),
    cc: document.getElementById("fCC").value.trim(),
    localidade: document.getElementById("fLocalidade").value.trim(),
    modelo: document.getElementById("fModelo").value.trim(),
    imei1: document.getElementById("fImei").value.trim(),
    imei2: document.getElementById("fImei2").value.trim(),
    serie: document.getElementById("fSerie").value.trim(),
    linha: document.getElementById("fLinha").value.trim(),
    chip: document.getElementById("fChip").value.trim(),
    cartaoPuk: document.getElementById("cCartaoPuk").checked,
    cidade: document.getElementById("fCidade").value.trim(),
    data: document.getElementById("fData").value.trim(),
    carregador: document.getElementById("cCarregador").checked,
    fone: document.getElementById("cFone").checked,
    usb: document.getElementById("cUsb").checked,
    selecionado: true
  };
}

function preencherFormulario(r) {
  // 1. Preenche todos os campos de texto e checkboxes com os dados do registro
  document.getElementById("fTicket").value = r.ticket || "";
  document.getElementById("fNome").value = r.nome || "";
  document.getElementById("fMatricula").value = r.matricula || "";
  document.getElementById("fCC").value = r.cc || "";
  document.getElementById("fLocalidade").value = r.localidade || "";
  document.getElementById("fModelo").value = r.modelo || "";
  document.getElementById("fImei").value = r.imei1 || "";
  document.getElementById("fImei2").value = r.imei2 || "";
  document.getElementById("fSerie").value = r.serie || "";
  document.getElementById("fLinha").value = r.linha || "";
  document.getElementById("fChip").value = r.chip || "";
  document.getElementById("cCartaoPuk").checked = Boolean(r.cartaoPuk);

  // ALTERADO: Pega a cidade e remove o estado (ex: "Curitiba - PR" vira "Curitiba")
  const cidadeCompleta = r.cidade || r.localidade || "Curitiba";
  document.getElementById("fCidade").value = cidadeCompleta.split(/[-/]/)[0].trim();

  document.getElementById("fData").value = r.data || hojePorExtenso();
  document.getElementById("cCarregador").checked = r.carregador;
  document.getElementById("cFone").checked = r.fone;
  document.getElementById("cUsb").checked = r.usb;

  // 2. Lógica dedicada e final para o modelo do termo
  // Se o modelo do aparelho for iPhone, força a seleção. Senão, usa o que veio do arquivo ou o padrão "A56".

  document.getElementById("fModeloTermo").value = r.modeloTermo || "A56";

  // 3. Dispara o evento 'change' para que a UI (carregador, regras de vencimento, etc.) seja atualizada
  document.getElementById("fModeloTermo").dispatchEvent(new Event('change'));
}

function limparNomeArquivo(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function nomePdf(r) {
  const local = limparNomeArquivo(r.localidade || "Local");
  const nome = limparNomeArquivo(r.nome || "Sem_Nome");
  const serie = limparNomeArquivo(r.serie || r.imei1 || "Sem_Serie");
  return `${local}_TR_Celular_${r.modeloTermo || "A56"}_${nome}_NS_${serie}.pdf`;
}

async function pdfBlobAtual() {
  const elemento = document.getElementById("termo");
  const canvas = await html2canvas(elemento, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  const img = canvas.toDataURL("image/jpeg", 0.96);
  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  pdf.addImage(img, "JPEG", 0, 0, 210, 297);
  return pdf.output("blob");
}

async function gerarPdfIndividual() {
  atualizarTermo(); // Garante que o preview esteja atualizado com os últimos dados do formulário
  const r = dadosFormulario();

  if (!r.nome || !r.serie) {
    mostrarStatus("Preencha pelo menos o nome e o número de série.");
    return;
  }

  mostrarStatus("Gerando PDF...");
  // Adicionar um pequeno atraso para garantir que o DOM seja renderizado antes de capturar
  await new Promise(resolve => setTimeout(resolve, 50)); // 50ms should be enough

  const blob = await pdfBlobAtual();
  baixarBlob(blob, nomePdf(r));
  mostrarStatus("PDF individual gerado.");
  // NOVO: Marcar o termo como gerado individualmente
  const identifier = `${r.ticket}:${r.serie}`;
  if (!generatedPdfIds.includes(identifier)) {
    generatedPdfIds.push(identifier);
    sessionStorage.setItem('updateGeneratedPdfs', JSON.stringify(generatedPdfIds));
  }
}

function baixarBlob(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function adicionarAtualAoLote() {
  const r = dadosFormulario();

  if (!r.nome && !r.serie && !r.imei1) {
    mostrarStatus("Preencha os dados antes de adicionar.");
    return;
  }

  registros.push(r);
  filtroAtual = [...registros];
  renderizarTabela();
  mostrarStatus("Registro adicionado ao lote.");
}

function normalizar(texto) {
  return String(texto ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function valor(linha, aliases) {
  const mapa = {};
  Object.keys(linha).forEach(k => mapa[normalizar(k)] = linha[k]);

  for (const alias of aliases) {
    const k = normalizar(alias);
    if (Object.prototype.hasOwnProperty.call(mapa, k)) {
      return String(mapa[k] ?? "").trim();
    }
  }

  return "";
}

function cleanCSVField(field) {
    if (!field) return '';
    return field.replace(/^[="]+/, '').replace(/[="]+$/, '');
}

function converterLinha(linha) {
  const modeloTelefone = valor(linha, ["Modelo do Telefone", "Modelo Telefone", "Modelo", "Marca e Modelo", "MARCA_MODELO"]);
  const modeloInformado = valor(linha, ["Modelo do Termo", "Tipo de Termo", "Modelo Termo"]);
  
  let modeloTermoFinal;

  // Lógica Aprimorada: iPhone tem prioridade máxima.
  if (/iphone/i.test(modeloTelefone)) {
    modeloTermoFinal = "iPhone";
  } else if (modeloInformado) {
    // Se não for iPhone, usa o modelo informado (normalizado) ou A56 como padrão.
    const upperModelo = modeloInformado.toUpperCase();
    modeloTermoFinal = ["A56", "A07", "A06"].includes(upperModelo) ? upperModelo : "A56";
  } else {
    // Se nenhum modelo de termo foi informado, deduz a partir do modelo do telefone.
    if (/A07/i.test(modeloTelefone)) modeloTermo = "A07";
    else if (/A06/i.test(modeloTelefone)) modeloTermo = "A06";
    else modeloTermo = "A56";
    modeloTermoFinal = modeloTermo;
  }

  return {
    modeloTermo: modeloTermoFinal,
    imei1: cleanCSVField(valor(linha, ["IMEI1","IMEI 1"])),
    imei2: cleanCSVField(valor(linha, ["IMEI2","IMEI 2"])),
    serie: cleanCSVField(valor(linha, ["Serie","Série","Número de Série","Numero Serie","S/N","NS"])),
    modelo: modeloTelefone,
    nome: valor(linha, ["Nome da Pessoa","Nome","Usuário","Usuario","Colaborador"]),
    matricula: valor(linha, ["Matrícula","Matricula"]),
    localidade: valor(linha, ["Local","Localidade"]),
    cidade: valor(linha, ["Cidade"]),
    cc: valor(linha, ["CC","Centro de Custo","Centro Custo"]),
    ticket: valor(linha, ["Ticket"]),
    linha: cleanCSVField(valor(linha, ["Linha","LINHA","Número da Linha","Numero da Linha","Telefone","Número do Telefone","Numero do Telefone"])),
    chip: valor(linha, ["CHIP","Chip","ICCID"]),
    cartaoPuk: /^(sim|s|true|1|x)$/i.test(valor(linha, ["Cartão PUK","Cartao PUK","PUK","Cartão com PUK","Cartao com PUK"])),
    data: valor(linha, ["Data"]) || hojePorExtenso(),
    carregador: modeloTermoFinal !== "iPhone",
    fone: false,
    usb: false,
    selecionado: true
  };
}

/**
 * NOVO: Calcula um hash SHA-256 para o conteúdo de um arquivo.
 * Isso cria uma "assinatura digital" única para cada lote.
 */
async function calculateFileHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.getElementById("arquivoPlanilha").addEventListener("change", async e => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;

  try {
    const hash = await calculateFileHash(arquivo);
    if (processedBatchHashes.includes(hash)) {
      openConfirmModal(
        "Lote Duplicado",
        "Este arquivo de lote já foi processado anteriormente. Deseja carregá-lo mesmo assim?",
        () => processarArquivo(arquivo) // Continua se confirmar
      );
      e.target.value = ""; // Limpa o input para permitir recarregar se cancelar e tentar de novo
      return; // Interrompe a execução aqui, pois o modal cuidará do resto
    }
    currentBatchHash = hash; // Armazena o hash do lote atual
    await processarArquivo(arquivo); // Processa o arquivo se não for duplicado
  } catch (error) {
    console.error("Erro ao calcular o hash do arquivo:", error);
    mostrarStatus("Erro ao verificar o arquivo. Tente novamente.");
    return;
  }
});

/**
 * NOVO: Função para processar o conteúdo do arquivo, separada do evento.
 */
async function processarArquivo(arquivo) {
  try {
    const buffer = await arquivo.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const aba = wb.Sheets[wb.SheetNames[0]];
    const linhas = XLSX.utils.sheet_to_json(aba, { defval: "", raw: false });

    registros = linhas
      .map(converterLinha)
      .filter(r => Object.values(r).some(v => String(v).trim() !== ""));

    filtroAtual = [...registros];
    renderizarTabela();
    mostrarStatus(`${registros.length} registro(s) carregado(s).`);
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    mostrarStatus("Falha ao ler o arquivo. Verifique se o formato está correto.");
  }
}

document.getElementById("pesquisaLote").addEventListener("input", function() {
  const termo = normalizar(this.value);

  filtroAtual = registros.filter(r =>
    Object.values(r).some(v => normalizar(v).includes(termo))
  );

  renderizarTabela();
});

function renderizarTabela() {
  const corpo = document.getElementById("corpoLote");
  corpo.innerHTML = "";

  filtroAtual.forEach(r => {
    const indiceReal = registros.indexOf(r);
    const tr = document.createElement("tr");
    if (r.selecionado) tr.classList.add("selected");

    tr.innerHTML = `
      <td><input type="checkbox" ${r.selecionado ? "checked" : ""} onchange="alternarSelecao(${indiceReal}, this.checked)"></td>
      <td>${r.nome || "-"}</td>
      <td>${r.modelo || "-"}</td>
      <td>${r.serie || "-"}</td>
      <td>${r.ticket || "-"}</td>
    `;

    tr.addEventListener("dblclick", () => {
      preencherFormulario(r);
      abrirModo("individual");
    });

    corpo.appendChild(tr);
  });

  atualizarContador();
}

function alternarSelecao(indice, valorSelecionado) {
  registros[indice].selecionado = valorSelecionado;
  renderizarTabela();
}

function selecionarTodos(valorSelecionado) {
  filtroAtual.forEach(r => r.selecionado = valorSelecionado);
  renderizarTabela();
}

function atualizarContador() {
  const selecionados = registros.filter(r => r.selecionado).length;
  document.getElementById("contadorLote").textContent =
    `${selecionados} de ${registros.length} registro(s) selecionado(s).`;
}

function visualizarSelecionado() {
  const r = registros.find(x => x.selecionado);

  if (!r) {
    mostrarStatus("Selecione pelo menos um registro.");
    return;
  }

  preencherFormulario(r);
  abrirModo("individual");
}

async function gerarZipLote() {
  const selecionados = registros.filter(r => r.selecionado);

  if (!selecionados.length) {
    mostrarStatus("Selecione pelo menos um registro.");
    return;
  }

  const zip = new JSZip();
  const dadosOriginais = dadosFormulario();

  for (let i = 0; i < selecionados.length; i++) {
    const r = selecionados[i];
    preencherFormulario(r);
    mostrarStatus(`Gerando ${i + 1} de ${selecionados.length}...`);

    await new Promise(resolve => setTimeout(resolve, 120));
    const blob = await pdfBlobAtual();
    zip.file(nomePdf(r), blob);
  }

  preencherFormulario(dadosOriginais);

  mostrarStatus("Compactando os PDFs...");

  // ALTERADO: Salva os identificadores no sessionStorage para a página principal ler ao voltar.
  const processedIds = selecionados.map(r => `${r.ticket}:${r.serie}`);
  const finalIds = [...new Set([...generatedPdfIds, ...processedIds])];
  sessionStorage.setItem('updateGeneratedPdfs', JSON.stringify(finalIds));


  // NOVO: Salva o hash do lote como processado após o sucesso
  if (currentBatchHash) {
    saveProcessedHash(currentBatchHash);
  }

  const arquivoZip = await zip.generateAsync({ type: "blob" });
  baixarBlob(arquivoZip, "Termos_Celulares.zip");
  mostrarStatus("ZIP com os PDFs individuais gerado.");
}

function mostrarStatus(texto) {
  document.getElementById("status").textContent = texto;
}

/**
 * NOVO: Carrega os hashes dos lotes processados do localStorage.
 */
function loadProcessedHashes() {
    const savedHashes = localStorage.getItem('processedBatchHashes');
    if (savedHashes) {
        processedBatchHashes = JSON.parse(savedHashes);
    }
}

/**
 * NOVO: Salva um novo hash de lote processado no localStorage.
 */
function saveProcessedHash(hash) {
    if (hash && !processedBatchHashes.includes(hash)) {
        processedBatchHashes.push(hash);
        localStorage.setItem('processedBatchHashes', JSON.stringify(processedBatchHashes));
    }
}

atualizarTermo();
renderizarTabela();

 /**
 * NOVO: Preenche o formulário individual com dados da URL ao carregar a página.
 */
function preencherComDadosDaUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.toString() === "") return; // Sai se não houver parâmetros

    // Mapeia cada parâmetro da URL para o campo correspondente no formulário
    document.getElementById("fTicket").value = params.get("fTicket") || "";
    document.getElementById("fNome").value = params.get("fNome") || "";
    document.getElementById("fMatricula").value = params.get("fMatricula") || "";
    document.getElementById("fCC").value = params.get("fCC") || "";
    document.getElementById("fLocalidade").value = params.get("fLocalidade") || "";
    document.getElementById("fModelo").value = params.get("fModelo") || "";
    document.getElementById("fImei").value = params.get("fImei") || "";
    document.getElementById("fImei2").value = params.get("fImei2") || "";
    document.getElementById("fSerie").value = params.get("fSerie") || "";
    document.getElementById("fLinha").value = params.get("fLinha") || "";
    document.getElementById("fChip").value = params.get("fChip") || "";
    document.getElementById("cCartaoPuk").checked = /^(sim|s|true|1|x)$/i.test(params.get("cCartaoPuk") || "");

    // CORREÇÃO: Preenche o campo Cidade com o valor da localidade vindo da URL.
    document.getElementById("fCidade").value = params.get("fLocalidade") || "Curitiba";
    // E APLICA A REGRA para remover o estado (ex: "Curitiba - PR" vira "Curitiba")
    const cidadeCompleta = params.get("fLocalidade") || "Curitiba";
    document.getElementById("fCidade").value = cidadeCompleta.split(/[-/]/)[0].trim();

    document.getElementById("fModeloTermo").value = params.get("fModeloTermo") || "A56";

    // Dispara a atualização da UI e da folha de visualização
    document.getElementById("fModeloTermo").dispatchEvent(new Event('change'));
    atualizarTermo(); // Garante que a folha seja renderizada
}

/**
 * NOVO: Carrega os dados enviados pela página principal via sessionStorage.
 */
function loadInitialData() {
    // Carrega os IDs de PDFs já gerados do sessionStorage, se existirem.
    // Isso é importante para que, ao gerar um PDF individual, a lista de IDs
    // já contenha os termos gerados anteriormente (seja em lote ou individualmente).
    const storedGeneratedIds = sessionStorage.getItem('currentGeneratedPdfIds');
    if (storedGeneratedIds) {
        try {
            generatedPdfIds = JSON.parse(storedGeneratedIds);
        } catch (e) {
            console.error("Erro ao carregar generatedPdfIds do sessionStorage:", e);
            generatedPdfIds = [];
        }
    }
}

/**
 * NOVO: Verifica se a página foi aberta com o parâmetro de download automático.
 */
async function autoDownload() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autodownload') === 'true') {
        // Desabilita botões para evitar interação do usuário
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        mostrarStatus("Preparando download automático...");

        try {
            // A função gerarPdfIndividual já faz tudo (atualiza, gera blob, baixa)
            await gerarPdfIndividual();
            
            // Tenta fechar a aba após um pequeno delay para garantir que o download iniciou
            setTimeout(() => {
                mostrarStatus("Download iniciado. Esta aba pode ser fechada.");
                // window.close(); // Comentado pois pode ser bloqueado pelo navegador.
            }, 1500);

        } catch (error) {
            console.error("Erro no download automático:", error);
            mostrarStatus("Falha no download automático. Verifique o console.");
            // Reabilita os botões se der erro
            document.querySelectorAll('button').forEach(b => b.disabled = false);
        }
    }
}

document.addEventListener("DOMContentLoaded", loadProcessedHashes);
document.addEventListener("DOMContentLoaded", preencherComDadosDaUrl);
document.addEventListener("DOMContentLoaded", loadInitialData);
document.addEventListener("DOMContentLoaded", autoDownload);
