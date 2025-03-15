importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");

let pyodideReady = false;
let pyodide = null;

async function iniciarPyodide() {
    pyodide = await loadPyodide();
    pyodideReady = true;
}

iniciarPyodide();

self.onmessage = async function(event) {
    if (!pyodideReady) {
        self.postMessage({ error: "Pyodide ainda está carregando..." });
        return;
    }

    let code = event.data.code;

    try {
        // Limpa a saída do Pyodide antes de cada nova execução
        pyodide.runPython(`
            import sys
            from io import StringIO
            sys.stdout = StringIO()  # Redefine o sys.stdout para uma nova instância de StringIO
        `);

        // Executa o código Python
        await pyodide.runPythonAsync(code);

        // Captura o resultado da execução
        let output = pyodide.runPython("sys.stdout.getvalue()");

        // Retorna a saída para o HTML
        self.postMessage({ output: output.trim() });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};







