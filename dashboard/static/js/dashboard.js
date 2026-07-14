/* ============================================================
   AGENTFLOW AI DASHBOARD
============================================================ */

/* ============================================================
   CONSOLE
============================================================ */

const consoleBody = document.getElementById("console");

function addLog(message, type = "info") {

    if (!consoleBody) return;

    const line = document.createElement("div");

    line.className = `console-line ${type}`;

    const time = new Date().toLocaleTimeString();

    line.innerHTML = `
        <span class="time">[${time}]</span>
        <span class="message">${message}</span>
    `;

    consoleBody.appendChild(line);

    consoleBody.scrollTop = consoleBody.scrollHeight;
}

const clearConsoleBtn = document.getElementById("clearConsole");

if (clearConsoleBtn) {

    clearConsoleBtn.addEventListener("click", () => {

        consoleBody.innerHTML = "";

    });

}

/* ============================================================
   PIPELINE
============================================================ */

const pipelineNodes = {

    search: document.getElementById("searchAgent"),
    content: document.getElementById("contentAgent"),
    writer: document.getElementById("writerAgent"),
    critic: document.getElementById("criticAgent")

};

const pipelineLines = {

    search: document.getElementById("line-search"),
    content: document.getElementById("line-content"),
    writer: document.getElementById("line-writer")

};

function resetPipeline() {

    Object.values(pipelineNodes).forEach(node => {

        if (!node) return;

        node.classList.remove("running", "success", "failed");

        const badge = node.querySelector(".node-state");

        if (badge) badge.textContent = "Idle";

    });

    Object.values(pipelineLines).forEach(line => {

        if (line) {

            line.classList.remove("active");

        }

    });

}

function activateAgent(name) {

    resetPipeline();

    const node = pipelineNodes[name];

    if (!node) return;

    node.classList.add("running");

    switch (name) {

        case "content":

            pipelineLines.search?.classList.add("active");
            break;

        case "writer":

            pipelineLines.content?.classList.add("active");
            break;

        case "critic":

            pipelineLines.writer?.classList.add("active");
            break;

    }

    const badge = node.querySelector(".node-state");

    if (badge) badge.textContent = "Running";

}

function completeAgent(name) {

    const node = pipelineNodes[name];

    if (!node) return;

    node.classList.remove("running");

    node.classList.add("success");

    const badge = node.querySelector(".node-state");

    if (badge) badge.textContent = "Completed";

}

function failAgent(name) {

    const node = pipelineNodes[name];

    if (!node) return;

    node.classList.remove("running");

    node.classList.add("failed");

    const badge = node.querySelector(".node-state");

    if (badge) badge.textContent = "Failed";

}

/* ============================================================
   METRICS
============================================================ */

const dashboard = {

    runtime: document.getElementById("runtime"),
    progress: document.getElementById("progress"),
    progressFill: document.getElementById("progressFill"),
    currentAgent: document.getElementById("currentAgent"),
    urlCount: document.getElementById("urlCount")

};

let runtimeSeconds = 0;
let timer = null;

function startRuntime() {

    runtimeSeconds = 0;

    clearInterval(timer);

    timer = setInterval(() => {

        runtimeSeconds++;

        const min = String(Math.floor(runtimeSeconds / 60)).padStart(2, "0");
        const sec = String(runtimeSeconds % 60).padStart(2, "0");

        dashboard.runtime.textContent = `${min}:${sec}`;

    }, 1000);

}

function stopRuntime() {

    clearInterval(timer);

}

function updateProgress(value) {

    dashboard.progress.textContent = value;
    dashboard.progressFill.style.width = `${value}%`;

}

function setCurrentAgent(name) {

    dashboard.currentAgent.textContent = name;

}

function updateURLs(value) {

    dashboard.urlCount.textContent = value;

}

/* ============================================================
   REPORTS
============================================================ */

function updateSearchResults(text) {

    const el = document.getElementById("searchResults");

    if (!el) return;

    const sections = text.split('---');

    let html = "";

    sections.forEach(section => {

        if (!section.trim()) return;

        const titleMatch = section.match(/Title:\s*(.*)/);
        const urlMatch = section.match(/URL:\s*(.*)/);
        const contentMatch = section.match(/Content:\s*([\s\S]*?)URL:/);

        const title = titleMatch ? titleMatch[1] : "Untitled";
        const url = urlMatch ? urlMatch[1] : "#";
        const content = contentMatch ? contentMatch[1] : "";

        html += `
            <div class="search-card-result">

                <h3>${title}</h3>

                <p>${content.substring(0,250)}...</p>

                <a href="${url}" target="_blank">
                    🔗 Visit Source
                </a>

            </div>
        `;
    });

    el.innerHTML = html;
}

function updateSummary(text) {

    const el = document.getElementById("summary");
    if (!el) return;
    el.innerHTML = marked.parse(text);

}


function updateReport(text){

    const el=document.getElementById("report");

    if(!el) return;

    el.innerHTML=marked.parse(text);

    hljs.highlightAll();

}

function updateCritique(text) {

    const el = document.getElementById("critique");

    if (!el) return;

    el.innerHTML = marked.parse(text);

}
/* ============================================================
   RESET
============================================================ */

function resetDashboard() {

    resetPipeline();

    updateProgress(0);

    updateURLs(0);

    setCurrentAgent("Idle");

    updateSearchResults("");

    updateSummary("");

    updateReport("");

    updateCritique("");

    if (consoleBody) {

        consoleBody.innerHTML = "";

    }

}

/* ============================================================
   START BUTTON
============================================================ */

function setButtonState(state){

    const startButton = document.getElementById("startBtn");

    if(!startButton) return;

    switch (state) {

        case "idle":

            startButton.disabled = false;
            startButton.innerHTML = "🚀 Start Research";
            break;

        case "init":

            startButton.disabled = true;
            startButton.innerHTML = "⏳ Initializing...";
            break;

        case "search":

            startButton.innerHTML = "🔍 Searching Web...";
            break;

        case "content":

            startButton.innerHTML = "📄 Reading Sources...";
            break;

        case "writer":

            startButton.innerHTML = "✍️ Writing Report...";
            break;

        case "critic":

            startButton.innerHTML = "🧠 Reviewing Report...";
            break;

        case "done":

            startButton.disabled = false;
            startButton.innerHTML = "✅ Research Complete";
            break;

        case "error":

            startButton.disabled = false;
            startButton.innerHTML = "❌ Try Again";
            break;

    }

}