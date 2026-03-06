document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsDiv = document.getElementById('results');
    const resumeInput = document.getElementById('resume-upload');
    const jobDescriptionInput = document.getElementById('job-description');

    const loadingIndicator = document.getElementById('loading');

    analyzeBtn.addEventListener('click', async () => {
        const file = resumeInput.files[0];
        const jobDescription = jobDescriptionInput.value;

        if (!file) {
            resultsDiv.innerHTML = '<span style="color: red;">Please select a PDF file first.</span>';
            return;
        }

        if (!jobDescription.trim()) {
            resultsDiv.innerHTML = '<span style="color: red;">Please enter a job description.</span>';
            return;
        }

        // Show loading, hide results
        loadingIndicator.style.display = 'block';
        resultsDiv.innerHTML = '';
        analyzeBtn.disabled = true;

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Display AI analysis results
                resultsDiv.innerHTML = `
                    <div class="analysis-results">
                        <div class="score-card">
                            <h2>Match Score</h2>
                            <div class="score-value">${data.matchScore}%</div>
                        </div>
                        
                        <div class="result-section">
                            <h3>Missing Keywords</h3>
                            <ul>
                                ${data.missingKeywords.length > 0
                        ? data.missingKeywords.map(kw => `<li>${kw}</li>`).join('')
                        : '<li>No missing keywords identified!</li>'}
                            </ul>
                        </div>

                        <div class="result-section">
                            <h3>Suggestions for Improvement</h3>
                            <ul>
                                ${data.suggestions.length > 0
                        ? data.suggestions.map(sug => `<li>${sug}</li>`).join('')
                        : '<li>No specific suggestions.</li>'}
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                resultsDiv.innerHTML = `<span style="color: red;">Error: ${data.error}</span>`;
            }
        } catch (error) {
            resultsDiv.innerHTML = `<span style="color: red;">Fetch error: ${error.message}</span>`;
        } finally {
            loadingIndicator.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    });
});

