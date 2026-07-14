let currentTopic = "";

const topicInput = document.getElementById("topic");

const startButton = document.getElementById("startBtn");


startButton.addEventListener("click", startResearch);

let currentTaskId = null;
let statusTimer = null;

function stopStatusPolling() {
    if (statusTimer) {
        clearInterval(statusTimer);
        statusTimer = null;
    }
}

function updateFromStatus(data) {
    if (!data) return;

    if (data.message) {
        addLog(data.message, "system");
    }

    if (data.stage) {
        setButtonState(data.stage);
        activateAgent(data.stage);
        setCurrentAgent(data.stage);
    }

    if (typeof data.progress === "number") {
        updateProgress(data.progress);
    }

    if (data.status === "completed") {
        stopStatusPolling();
        stopRuntime();
        updateProgress(100);
        setButtonState("done");
        completeAgent("critic");
        addLog("Research completed.", "success");
        updateSearchResults(data.search_results || "");
        updateSummary(data.research_information || "");
        updateReport(data.report || "");
        updateCritique(data.critique || "");
        showToast("Research Finished");
        loadHistory();
    }

    if (data.status === "failed") {
        stopStatusPolling();
        stopRuntime();
        setButtonState("error");
        addLog(data.error || "Research failed", "error");
    }
}

async function startResearch(){

    const topic = topicInput.value.trim();
    currentTopic = topic;

    if(!topic){

        showToast("Enter a research topic");

        return;

    }

    stopStatusPolling();
    resetDashboard();

    setButtonState("init");

    startRuntime();

    addLog("Starting research...", "system");

    try{

        const response = await fetch("/api/research/",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                topic

            })

        });

        const data = await response.json();

        if(!data.success){

            throw new Error(data.error);

        }

        currentTaskId = data.task_id;
        updateFromStatus(data);

        statusTimer = setInterval(async () => {
            if (!currentTaskId) return;

            try {
                const statusResponse = await fetch(`/api/research/${currentTaskId}/`);
                const statusData = await statusResponse.json();
                updateFromStatus(statusData);
            } catch (error) {
                console.error(error);
            }
        }, 1500);

    }



    catch(error){

        console.error(error);

        addLog(error.message,"error");

        stopRuntime();

        setButtonState("error");

    }

}

async function loadHistory() {

    try {

        const response = await fetch("/api/history/");

        if (!response.ok) {
            throw new Error("Couldn't load history");
        }

        const data = await response.json();
        console.log(data);

        const history = document.getElementById("historyList");
        console.log(history);

        if (!history) return;

        history.innerHTML = "";

        data.history.forEach(item => {

            history.innerHTML += `
<div
    class="history-item"
    onclick="openResearch(${item.id})">

    <strong>${item.topic}</strong>

    <span class="history-status ${item.status}">
        ${item.status}
    </span>

    <small>${item.created_at}</small>

</div>
`;

        });

    }

    catch (error) {

        console.error(error);

    }

}


async function openResearch(id){

    try{

        const response = await fetch(`/api/history/${id}/`);

        const data = await response.json();

        if(!data.success){

            throw new Error(data.error);

        }

        updateSearchResults(data.search_results);

        updateSummary(data.research_information);

        updateReport(data.report);

        updateCritique(data.critique);

        setCurrentAgent("Completed");

        updateProgress(100);

        setButtonState("done");

        addLog(`Loaded "${data.topic}" from history`, "success");

    }

    catch(error){

        console.error(error);

        showToast("Couldn't load report");

    }

}

window.addEventListener("DOMContentLoaded", () => {

    loadHistory();

});




document.getElementById("reportTopic").textContent =
    `Topic: ${topic}`;

document.getElementById("reportDate").textContent =
    `Generated: ${new Date().toLocaleString()}`;