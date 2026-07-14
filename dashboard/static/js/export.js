/*************************************************
                COPY REPORT
*************************************************/

const copyBtn = document.getElementById("copyReportBtn");

if (copyBtn) {

    copyBtn.addEventListener("click", async () => {

        const report = document
            .getElementById("report")
            .innerText;

        await navigator.clipboard.writeText(report);

        showToast("Report copied successfully!");

    });

}


/*************************************************
                PDF EXPORT
*************************************************/

const pdfBtn = document.getElementById("downloadPdfBtn");


if (pdfBtn) {

    pdfBtn.addEventListener(
        "click",
        downloadPDF
    );

}


async function downloadPDF() {

    // -----------------------------------------
    // Get Report Contents
    // -----------------------------------------

    const summary = document
        .getElementById("summary")
        .innerText;


    const report = document
        .getElementById("report")
        .innerText;


    const critique = document
        .getElementById("critique")
        .innerText;


    // -----------------------------------------
    // Date & Topic
    // -----------------------------------------

    const generatedDate = new Date()
        .toLocaleString();


    // -----------------------------------------
    // Create PDF
    // -----------------------------------------

    const { jsPDF } = window.jspdf;


    const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
    );


    // -----------------------------------------
    // PAGE 1
    // Header
    // -----------------------------------------

    pdf.setFontSize(22);

    pdf.text(
        "AGENTFLOW AI",
        20,
        20
    );


    pdf.setFontSize(15);

    pdf.text(
        "Multi-Agent Research Report",
        20,
        30
    );


    pdf.setFontSize(12);

    pdf.text(
        `Topic : ${currentTopic}`,
        20,
        45
    );


    pdf.text(
        `Generated : ${generatedDate}`,
        20,
        55
    );


    // -----------------------------------------
    // Summary
    // -----------------------------------------

    pdf.setFontSize(16);

    pdf.text(
        "Research Summary",
        20,
        75
    );


    pdf.setFontSize(11);


    const summaryLines = pdf.splitTextToSize(
        summary,
        170
    );


    pdf.text(
        summaryLines,
        20,
        85
    );


    // -----------------------------------------
    // PAGE 2
    // Final Report
    // -----------------------------------------

    pdf.addPage();


    pdf.setFontSize(18);

    pdf.text(
        "Final Research Report",
        20,
        20
    );


    pdf.setFontSize(11);


    const reportLines = pdf.splitTextToSize(
        report,
        170
    );


    pdf.text(
        reportLines,
        20,
        35
    );


    // -----------------------------------------
    // PAGE 3
    // AI Critique
    // -----------------------------------------

    pdf.addPage();


    pdf.setFontSize(18);

    pdf.text(
        "AI Critique",
        20,
        20
    );


    pdf.setFontSize(11);


    const critiqueLines = pdf.splitTextToSize(
        critique,
        170
    );


    pdf.text(
        critiqueLines,
        20,
        35
    );


    // -----------------------------------------
    // Save PDF
    // -----------------------------------------

    pdf.save(
        "AgentFlow-Research-Report.pdf"
    );

}