function calcular() {
    const espessura = parseFloat(document.getElementById("espessura").value) / 1000;
    const largura = parseFloat(document.getElementById("largura").value) / 1000;
    const metragem = parseFloat(document.getElementById("metragem").value);
    const saida = parseFloat(document.getElementById("saida").value);
    const densidade = parseFloat(document.getElementById("densidade").value);
    const tipo = document.getElementById("tipo").value;
    const obs = document.getElementById("obs").value;

    const area = largura * 1;
    const volume = metragem * area * espessura;
    const gasto = volume * densidade;
    const rendimento = saida > 0 ? metragem / saida : 0;

    document.getElementById("area").innerText = area.toFixed(2);
    document.getElementById("volume").innerText = volume.toFixed(3);
    document.getElementById("gasto").innerText = gasto.toFixed(1);
    document.getElementById("rendimento").innerText = rendimento.toFixed(2);
    document.getElementById("tipoSelected").innerText = tipo.replace("_", " ");
    document.getElementById("obsText").innerText = obs !== "" ? obs : "-";
}

function limpar() {
    document.getElementById("espessura").value = 1.2;
    document.getElementById("largura").value = 50;
    document.getElementById("metragem").value = 100;
    document.getElementById("saida").value = 200;
    document.getElementById("densidade").value = 900;
    document.getElementById("tipo").value = "malha_tecida";
    document.getElementById("obs").value = "";

    document.getElementById("area").innerText = "0.00";
    document.getElementById("volume").innerText = "0.000";
    document.getElementById("gasto").innerText = "0.0";
    document.getElementById("rendimento").innerText = "0.00";
    document.getElementById("tipoSelected").innerText = "-";
    document.getElementById("obsText").innerText = "-";
}

function exportarCSV() {
    const data = [{
        Espessura_mm: document.getElementById("espessura").value,
        Largura_mm: document.getElementById("largura").value,
        Tipo: document.getElementById("tipo").value,
        Metragem_m: document.getElementById("metragem").value,
        Saida_pecas: document.getElementById("saida").value,
        Densidade_kg_m3: document.getElementById("densidade").value,
        Observacoes: document.getElementById("obs").value,
        Area_m2_m: document.getElementById("area").innerText,
        Volume_m3: document.getElementById("volume").innerText,
        Gasto_kg: document.getElementById("gasto").innerText,
        Rendimento_m_por_peca: document.getElementById("rendimento").innerText
    }];

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "resumo_producao.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
