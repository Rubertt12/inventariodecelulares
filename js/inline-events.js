/* Eventos declarativos extraídos dos HTMLs. */
(function () {
'use strict';
const handlers = {
"handler1": function(event) {
switchView('dashboard')
},
"handler2": function(event) {
switchView('cadastro')
},
"handler3": function(event) {
switchView('estoque')
},
"handler4": function(event) {
switchView('estoque-usados')
},
"handler5": function(event) {
switchView('termos')
},
"handler6": function(event) {
window.location.href='geradordetermoprojetov1.html'
},
"handler7": function(event) {
window.location.href='zebra/zebra.html'
},
"handler8": function(event) {
document.getElementById('inputImportarLoteZip').click()
},
"handler9": function(event) {
window.location.href='Gerador_Caixa_Etiqueta.html'
},
"handler10": function(event) {
switchView('configuracoes')
},
"handler11": function(event) {
switchView('estoque')
},
"handler12": function(event) {
switchView('termos')
},
"handler13": function(event) {
switchView('estoque-usados')
},
"handler14": function(event) {
switchView('estoque'); activateFilter(document.querySelector('#locationFilterGroup button[data-filter=\'Enviados\']'))
},
"handler15": function(event) {
switchView('cadastro')
},
"handler16": function(event) {
switchView('termos')
},
"handler17": function(event) {
switchView('estoque'); setTimeout(() => document.getElementById('inputSearchStock').focus(), 100);
},
"handler18": function(event) {
switchView('configuracoes')
},
"handler19": function(event) {
setModeloTermo('A07')
},
"handler20": function(event) {
setModeloTermo('A56')
},
"handler21": function(event) {
closeEntregaModal()
},
"handler22": function(event) {
copyInfoToClipboard('entregaNome')
},
"handler23": function(event) {
copyInfoToClipboard('entregaMatricula')
},
"handler24": function(event) {
copyInfoToClipboard('entregaCC')
},
"handler25": function(event) {
copyInfoToClipboard('entregaLocal')
},
"handler26": function(event) {
copyInfoToClipboard('entregaTicket')
},
"handler27": function(event) {
copyInfoToClipboard('entregaTecnico')
},
"handler28": function(event) {
closeStockActionModal()
},
"handler29": function(event) {
window.location.href='celular.rubertt.html'
},
"handler30": function(event) {
showPanel('box')
},
"handler31": function(event) {
showPanel('label')
},
"handler32": function(event) {
savePNG('boxPanel','desenho_caixa')
},
"handler33": function(event) {
savePNG('labelPreview','etiqueta_envio')
},
"handler34": function(event) {
printLabel()
},
"handler35": function(event) {
window.location.href='celular.rubertt.html'
},
"handler36": function(event) {
abrirModo('individual')
},
"handler37": function(event) {
abrirModo('lote')
},
"handler38": function(event) {
abrirModo('modelo')
},
"handler39": function(event) {
gerarPdfIndividual()
},
"handler40": function(event) {
limparFormulario()
},
"handler41": function(event) {
adicionarAtualAoLote()
},
"handler42": function(event) {
selecionarTodos(true)
},
"handler43": function(event) {
selecionarTodos(false)
},
"handler44": function(event) {
visualizarSelecionado()
},
"handler45": function(event) {
gerarZipLote()
},
"handler46": function(event) {
window.location.href='../celular.rubertt.html'
},
"handler47": function(event) {
salvarConfiguracao()
},
"handler48": function(event) {
restaurarPadrao()
},
"handler49": function(event) {
processarExcel(event)
},
"handler50": function(event) {
document.getElementById('excelFile').click()
},
"handler51": function(event) {
limparExcel()
},
"handler52": function(event) {
baixarModeloExcel()
},
"handler53": function(event) {
carregarModelo()
},
"handler54": function(event) {
gerar()
},
"handler55": function(event) {
gerar()
},
"handler56": function(event) {
gerar()
},
"handler57": function(event) {
ajustarFonte('t', 5)
},
"handler58": function(event) {
ajustarFonte('t', -5)
},
"handler59": function(event) {
ajustarPosicao('t', 'y', -5)
},
"handler60": function(event) {
ajustarPosicao('t', 'x', -5)
},
"handler61": function(event) {
ajustarPosicao('t', 'x', 5)
},
"handler62": function(event) {
ajustarPosicao('t', 'y', 5)
},
"handler63": function(event) {
gerar()
},
"handler64": function(event) {
ajustarFonte('p', 5)
},
"handler65": function(event) {
ajustarFonte('p', -5)
},
"handler66": function(event) {
ajustarPosicao('p', 'y', -5)
},
"handler67": function(event) {
ajustarPosicao('p', 'x', -5)
},
"handler68": function(event) {
ajustarPosicao('p', 'x', 5)
},
"handler69": function(event) {
ajustarPosicao('p', 'y', 5)
},
"handler70": function(event) {
sincronizarSerial(this.value)
},
"handler71": function(event) {
ajustarFonte('s', 5)
},
"handler72": function(event) {
ajustarFonte('s', -5)
},
"handler73": function(event) {
ajustarPosicao('s', 'y', -5)
},
"handler74": function(event) {
ajustarPosicao('s', 'x', -5)
},
"handler75": function(event) {
ajustarPosicao('s', 'x', 5)
},
"handler76": function(event) {
ajustarPosicao('s', 'y', 5)
},
"handler77": function(event) {
ajustarPosicao('b', 'y', -5)
},
"handler78": function(event) {
ajustarPosicao('b', 'x', -5)
},
"handler79": function(event) {
ajustarPosicao('b', 'x', 5)
},
"handler80": function(event) {
ajustarPosicao('b', 'y', 5)
},
"handler81": function(event) {
gerar()
},
"handler82": function(event) {
gerar()
},
"handler83": function(event) {
gerar()
},
"handler84": function(event) {
ajustarFonte('imei1', 5)
},
"handler85": function(event) {
ajustarFonte('imei1', -5)
},
"handler86": function(event) {
ajustarPosicao('imei1', 'y', -5)
},
"handler87": function(event) {
ajustarPosicao('imei1', 'x', -5)
},
"handler88": function(event) {
ajustarPosicao('imei1', 'x', 5)
},
"handler89": function(event) {
ajustarPosicao('imei1', 'y', 5)
},
"handler90": function(event) {
gerar()
},
"handler91": function(event) {
ajustarFonte('imei2', 5)
},
"handler92": function(event) {
ajustarFonte('imei2', -5)
},
"handler93": function(event) {
ajustarPosicao('imei2', 'y', -5)
},
"handler94": function(event) {
ajustarPosicao('imei2', 'x', -5)
},
"handler95": function(event) {
ajustarPosicao('imei2', 'x', 5)
},
"handler96": function(event) {
ajustarPosicao('imei2', 'y', 5)
},
"handler97": function(event) {
gerar()
},
"handler98": function(event) {
ajustarFonte('sn', 5)
},
"handler99": function(event) {
ajustarFonte('sn', -5)
},
"handler100": function(event) {
ajustarPosicao('sn', 'y', -5)
},
"handler101": function(event) {
ajustarPosicao('sn', 'x', -5)
},
"handler102": function(event) {
ajustarPosicao('sn', 'x', 5)
},
"handler103": function(event) {
ajustarPosicao('sn', 'y', 5)
},
"handler104": function(event) {
gerar()
},
"handler105": function(event) {
gerar()
},
"handler106": function(event) {
atualizarPreview(this.value)
},
"handler107": function(event) {
enviarParaImpressora()
}
};
const types = ["click","change","input"];
types.forEach(type => {
 document.addEventListener(type, event => {
  let element = event.target;
  while (element && element !== document) {
   if (element instanceof Element) {
    const id = element.getAttribute('data-inline-' + type);
    const handler = id && handlers[id];
    if (handler) {
     const result = handler.call(element, event);
     if (result === false) { event.preventDefault(); event.stopPropagation(); }
     if (event.cancelBubble) break;
    }
   }
   element = element.parentElement;
  }
 }, true);
});
})();
