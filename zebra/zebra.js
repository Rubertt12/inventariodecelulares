/* JavaScript extraído de zebra/zebra.js; ordem original dos scripts inline preservada. */
const CONFIG_STORAGE_KEY = 'zplConfigV1';
    let dadosExcel = [];

    const defaultFontSizes = { t: 55, p: 45, s: 45, imei1: 45, imei2: 45, sn: 45, nome: 45 };
    const defaultPositions = {
        t: { x: -11, y: 30 }, p: { x: -30, y: 95 }, s: { x: 20, y: 150 },
        b: { x: 0, y: 200 }, b_text: { x: 0, y: 280 },
        imei1: { x: 0, y: 40 }, imei2: { x: 0, y: 100 }, sn: { x: 0, y: 160 }, nome: { x: 0, y: 220 }
    };

    let tamanhosFonte = { ...defaultFontSizes };
    let posicoes = JSON.parse(JSON.stringify(defaultPositions));

    const modelos = {
        padrao: "^XA\n^PW{{pw_padrao}}\n^LL{{ll_padrao}}\n^CI28\n^FO{{x_t}},{{y_t}}^A0N,{{font_t}},^FB{{pw_padrao}},1,0,C^FD{{val_t}}^FS\n^FO{{x_p}},{{y_p}}^A0N,{{font_p}},{{font_p}}^FB{{pw_padrao}},1,0,C^FDPATRIMONIO: {{val_p}}^FS\n^FO{{x_s}},{{y_s}}^A0N,{{font_s}},{{font_s}}^FB{{pw_padrao}},1,0,L^FDSN: {{val_s}}^FS\n^BY3,3\n^FO{{x_b}},{{y_b}}^FB{{pw_padrao}},1,0,C,0^BCN,80,N,N,N,A^FD{{val_b}}^FS\n^FO{{x_b_text}},{{y_b_text}}^A0N,20,20^FB{{pw_padrao}},1,0,C^FD{{val_b}}^FS\n^PQ{{qtd}}\n^XZ",
        celular: "^XA\n^PW{{pw_cel}}\n^LL{{ll_cel}}\n^CI28\n^FO{{x_imei1}},{{y_imei1}}^A0N,{{font_imei1}},{{font_imei1}}^FB{{pw_cel}},1,0,C^FDIMEI 1: {{val_imei1}}^FS\n^FO{{x_imei2}},{{y_imei2}}^A0N,{{font_imei2}},{{font_imei2}}^FB{{pw_cel}},1,0,C^FDIMEI 2: {{val_imei2}}^FS\n^FO{{x_sn}},{{y_sn}}^A0N,{{font_sn}},{{font_sn}}^FB{{pw_cel}},1,0,C^FDS/N: {{val_sn}}^FS\n^FO{{x_nome}},{{y_nome}}^A0N,{{font_nome}},{{font_nome}}^FB{{pw_cel}},1,0,C^FD{{val_nome}}^FS\n^PQ{{qtd}}\n^XZ",
        minimal: "^XA\n^PW{{pw_padrao}}\n^FO20,20^A0N,{{font_t}},{{font_t}}^FD{{val_t}}^FS\n^FO20,80^A0N,{{font_p}},{{font_p*0.75}}^FD{{val_p}} | {{val_s}}^FS\n^FO20,130^BY2^{{bc_type_padrao}}^FD{{val_b}}^FS\n^PQ{{qtd}}\n^XZ"
    };

    function processarExcel(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet);

            if (json.length === 0) {
                alert("A planilha está vazia!");
                return;
            }

            dadosExcel = json;
            document.getElementById('btnClearExcel').style.display = 'inline-block';
            document.getElementById('boxQtdManual').style.display = 'none';
            alert(`${json.length} etiquetas carregadas da planilha!`);
            gerar();
        };
        reader.readAsArrayBuffer(file);
    }

    function limparExcel() {
        dadosExcel = [];
        document.getElementById('excelFile').value = '';
        document.getElementById('btnClearExcel').style.display = 'none';
        document.getElementById('boxQtdManual').style.display = 'block';
        gerar();
    }

    function gerar() {
        const modo = document.getElementById('templateSelector').value;
        let templateOriginal = modelos[modo];
        let zplFinal = "";

        if (dadosExcel.length > 0) {
            // Gerar múltiplos blocos com base nas linhas da planilha
            dadosExcel.forEach(row => {
                let t = aplicarSubstituicoes(templateOriginal, modo, row);
                zplFinal += t + "\n";
            });
        } else {
            // Gerar apenas uma com os inputs da tela
            zplFinal = aplicarSubstituicoes(templateOriginal, modo, null);
        }

        document.getElementById('zplCode').value = zplFinal;
        
        // Preview exibe a primeira etiqueta do lote
        const primeiroBloco = zplFinal.split("^XZ")[0] + "^XZ";
        atualizarPreview(primeiroBloco);
    }

    function aplicarSubstituicoes(template, modo, excelRow) {
        let res = template;
        const qtdInput = document.getElementById('qtd_etiquetas');
        let qtd = excelRow ? (excelRow.Qtd || excelRow.QTD || excelRow.qtd || 1) : (parseInt(qtdInput.value) || 1);

        let inputs = {};
        if (modo === 'celular') {
            inputs = {
                pw_cel: document.getElementById('pw_cel').value,
                ll_cel: document.getElementById('ll_cel').value,
                val_imei1: excelRow ? (excelRow.IMEI1 || excelRow.imei1 || "") : document.getElementById('val_imei1').value,
                val_imei2: excelRow ? (excelRow.IMEI2 || excelRow.imei2 || "") : document.getElementById('val_imei2').value,
                val_sn: excelRow ? (excelRow.SN || excelRow.sn || excelRow.Serial || "") : document.getElementById('val_sn').value,
                val_nome: excelRow ? (excelRow.Nome || excelRow.nome || "") : document.getElementById('val_nome').value
            };
        } else {
            const valS = excelRow ? (excelRow.Serial || excelRow.SERIAL || excelRow.serial || "") : document.getElementById('val_s').value;
            inputs = {
                pw_padrao: document.getElementById('pw_padrao').value,
                ll_padrao: document.getElementById('ll_padrao').value,
                val_t: document.getElementById('val_t').value,
                val_p: excelRow ? (excelRow.Patrimonio || excelRow.PATRIMONIO || excelRow.patrimonio || "") : document.getElementById('val_p').value,
                val_s: valS,
                val_b: valS,
                bc_type_padrao: document.getElementById('bc_type_padrao').value
            };
        }

        Object.keys(inputs).forEach(id => {
            res = res.replace(new RegExp(`{{${id}}}`, 'g'), inputs[id]);
        });

        res = res.replace(new RegExp(`{{qtd}}`, 'g'), qtd);

        // Substituição de Fontes
        Object.keys(tamanhosFonte).forEach(key => {
            res = res.replace(new RegExp(`{{font_${key}}}`, 'g'), Math.round(tamanhosFonte[key]));
        });

        // Substituição de Posições
        Object.keys(posicoes).forEach(key => {
            res = res.replace(new RegExp(`{{x_${key}}}`, 'g'), Math.round(posicoes[key].x));
            res = res.replace(new RegExp(`{{y_${key}}}`, 'g'), Math.round(posicoes[key].y));
        });

        if (modo === 'celular' && !inputs.val_nome) {
            const nomeRegex = new RegExp(`\\^FO{{x_nome}},{{y_nome}}\\^A0N,{{font_nome}},{{font_nome}}\\^FB{{pw_cel}},1,0,C\\^FD{{val_nome}}\\^FS\\n`, 'g');
            res = res.replace(nomeRegex, '');
        }

        return res;
    }

    function ajustarFonte(campo, ajuste) {
        tamanhosFonte[campo] = Math.max(10, tamanhosFonte[campo] + ajuste);
        gerar();
    }

    function ajustarPosicao(campo, eixo, ajuste) {
        posicoes[campo][eixo] += ajuste;
        if (campo === 'b') posicoes['b_text'][eixo] += ajuste;
        gerar();
    }

    function sincronizarSerial(valor) {
        document.getElementById('val_b').value = valor;
        gerar();
    }

    function salvarConfiguracao() {
        const config = {
            modelo: document.getElementById('templateSelector').value,
            tamanhosFonte: tamanhosFonte,
            posicoes: posicoes,
            inputs: {
                pw_padrao: document.getElementById('pw_padrao').value,
                ll_padrao: document.getElementById('ll_padrao').value,
                val_t: document.getElementById('val_t').value,
                val_p: document.getElementById('val_p').value,
                val_s: document.getElementById('val_s').value,
                val_b: document.getElementById('val_b').value,
                pw_cel: document.getElementById('pw_cel').value,
                ll_cel: document.getElementById('ll_cel').value,
                val_imei1: document.getElementById('val_imei1').value,
                val_imei2: document.getElementById('val_imei2').value,
                val_sn: document.getElementById('val_sn').value,
                val_nome: document.getElementById('val_nome').value,
                qtd_etiquetas: document.getElementById('qtd_etiquetas').value
            }
        };
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        alert('Ajustes salvos!');
    }

    function carregarConfiguracao() {
        const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            tamanhosFonte = config.tamanhosFonte || defaultFontSizes;
            posicoes = config.posicoes || defaultPositions;
            document.getElementById('templateSelector').value = config.modelo || 'padrao';
            for (const id in config.inputs) {
                const element = document.getElementById(id);
                if (element) element.value = config.inputs[id];
            }
        }
    }

    function restaurarPadrao() {
        if (confirm('Restaurar as configurações padrão?')) {
            localStorage.removeItem(CONFIG_STORAGE_KEY);
            window.location.reload();
        }
    }

    function carregarModelo() {
        const modo = document.getElementById('templateSelector').value;
        const isCelular = (modo === 'celular');

        document.getElementById('controlsPadrao').style.display = isCelular ? 'none' : 'block';
        document.getElementById('controlsCelular').style.display = isCelular ? 'block' : 'none';

        sincronizarSerial(document.getElementById('val_s').value);
        gerar(); 
    }

    function atualizarPreview(zpl) { 
        document.getElementById('labelPreview').src = `https://api.labelary.com/v1/printers/8dpmm/labels/4x2/0/${encodeURIComponent(zpl)}`; 
    }

    function baixarModeloExcel() {
        const ws = XLSX.utils.json_to_sheet([
            { Patrimonio: "AM005473", Serial: "3X0D6R3", Qtd: 1 },
            { Patrimonio: "AM005474", Serial: "4Y1E7S4", Qtd: 2 }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Etiquetas");
        XLSX.writeFile(wb, "modelo_etiquetas_voke.xlsx");
    }

    async function enviarParaImpressora() {
        try {
            if (!qz.websocket.isActive()) await qz.websocket.connect();
            await qz.print(qz.configs.create("etiqueta"), [document.getElementById('zplCode').value]);
            alert("Impressão enviada!");
        } catch (e) { alert("Erro ao imprimir: " + e); }
    }
    
    function preencherComURLParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('modelo') === 'celular') {
            document.getElementById('templateSelector').value = 'celular';
            document.getElementById('val_imei1').value = params.get('imei1') || '';
            document.getElementById('val_imei2').value = params.get('imei2') || '';
            document.getElementById('val_sn').value = params.get('sn') || '';
        }
        if (params.get('qtd')) document.getElementById('qtd_etiquetas').value = params.get('qtd');
        
        carregarModelo();
    }

    carregarConfiguracao();
    preencherComURLParams();
