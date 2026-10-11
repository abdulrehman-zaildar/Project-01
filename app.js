// ========== SmartBijli - AI Electricity Bill Analyzer ==========
// Main Application Logic

// ---- State ----
let appliances = [];
let apiKey = '';

// ---- DOM Elements ----
const apiKeyInput = document.getElementById('apiKey');
const toggleApiKeyBtn = document.getElementById('toggleApiKey');
const apiStatus = document.getElementById('apiStatus');
const ratePerUnitInput = document.getElementById('ratePerUnit');
const applianceNameSelect = document.getElementById('applianceName');
const customNameInput = document.getElementById('customName');
const applianceWattInput = document.getElementById('applianceWatt');
const applianceQtyInput = document.getElementById('applianceQty');
const applianceHoursInput = document.getElementById('applianceHours');
const addApplianceBtn = document.getElementById('addApplianceBtn');
const applianceListCard = document.getElementById('applianceListCard');
const applianceTableBody = document.getElementById('applianceTableBody');
const clearAllBtn = document.getElementById('clearAllBtn');
const totalKwhEl = document.getElementById('totalKwh');
const totalCostEl = document.getElementById('totalCost');
const summaryCard = document.getElementById('summaryCard');
const summaryUnits = document.getElementById('summaryUnits');
const summaryDaily = document.getElementById('summaryDaily');
const summaryMonthly = document.getElementById('summaryMonthly');
const summaryYearly = document.getElementById('summaryYearly');
const scoreCircle = document.getElementById('scoreCircle');
const scoreText = document.getElementById('scoreText');
const scoreLabel = document.getElementById('scoreLabel');
const analyzeBtn = document.getElementById('analyzeBtn');
const aiResponseCard = document.getElementById('aiResponseCard');
const aiLoading = document.getElementById('aiLoading');
const aiContent = document.getElementById('aiContent');

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    // Load saved API key
    const savedKey = localStorage.getItem('smartbijli_apikey');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        apiKey = savedKey;
        showApiStatus('API key loaded from saved data', 'success');
    }

    // Load saved appliances
    const savedAppliances = localStorage.getItem('smartbijli_appliances');
    if (savedAppliances) {
        appliances = JSON.parse(savedAppliances);
        renderAppliances();
    }
});

// ---- API Key Toggle ----
toggleApiKeyBtn.addEventListener('click', () => {
    const input = apiKeyInput;
    if (input.type === 'password') {
        input.type = 'text';
        toggleApiKeyBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        toggleApiKeyBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// ---- API Key Save ----
apiKeyInput.addEventListener('change', () => {
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('smartbijli_apikey', apiKey);
        showApiStatus('API key saved ✓', 'success');
    }
});

function showApiStatus(message, type) {
    apiStatus.textContent = message;
    apiStatus.style.color = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#f59e0b';
    setTimeout(() => { apiStatus.textContent = ''; }, 3000);
}

// ---- Auto-fill wattage when selecting an appliance ----
applianceNameSelect.addEventListener('change', () => {
    const selected = applianceNameSelect.selectedOptions[0];
    const watt = selected.getAttribute('data-watt');
    if (watt) {
        applianceWattInput.value = watt;
    }
});

// ---- Add Appliance ----
addApplianceBtn.addEventListener('click', () => {
    const selectedOption = applianceNameSelect.value;
    const customName = customNameInput.value.trim();
    const name = customName || selectedOption;
    const watts = parseInt(applianceWattInput.value);
    const qty = parseInt(applianceQtyInput.value) || 1;
    const hours = parseFloat(applianceHoursInput.value);

    // Validation
    if (!name) {
        shakeElement(applianceNameSelect);
        return alert('Please select or enter an appliance name.');
    }
    if (!watts || watts <= 0) {
        shakeElement(applianceWattInput);
        return alert('Please enter valid wattage.');
    }
    if (!hours || hours <= 0 || hours > 24) {
        shakeElement(applianceHoursInput);
        return alert('Please enter valid hours (0.5 - 24).');
    }

    const appliance = {
        id: Date.now(),
        name,
        watts,
        qty,
        hours,
        kwhPerMonth: calculateKwh(watts, qty, hours),
    };

    appliances.push(appliance);
    saveAppliances();
    renderAppliances();
    resetForm();
});

function calculateKwh(watts, qty, hours) {
    return ((watts * qty * hours * 30) / 1000);
}

function resetForm() {
    applianceNameSelect.value = '';
    customNameInput.value = '';
    applianceWattInput.value = '';
    applianceQtyInput.value = '1';
    applianceHoursInput.value = '';
}

function shakeElement(el) {
    el.style.borderColor = '#ef4444';
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
        el.style.borderColor = '';
        el.style.animation = '';
    }, 500);
}

// ---- Render Appliances ----
function renderAppliances() {
    if (appliances.length === 0) {
        applianceListCard.style.display = 'none';
        summaryCard.style.display = 'none';
        aiResponseCard.style.display = 'none';
        return;
    }

    applianceListCard.style.display = 'block';
    summaryCard.style.display = 'block';

    const rate = parseFloat(ratePerUnitInput.value) || 35;

    // Build table rows
    applianceTableBody.innerHTML = appliances.map(a => {
        const cost = (a.kwhPerMonth * rate).toFixed(0);
        return `
            <tr>
                <td>${a.name}</td>
                <td>${a.watts}W</td>
                <td>${a.qty}</td>
                <td>${a.hours}h</td>
                <td>${a.kwhPerMonth.toFixed(1)}</td>
                <td>PKR ${numberWithCommas(cost)}</td>
                <td><button class="delete-btn" onclick="deleteAppliance(${a.id})"><i class="fas fa-times"></i></button></td>
            </tr>
        `;
    }).join('');

    // Calculate totals
    const totalKwh = appliances.reduce((sum, a) => sum + a.kwhPerMonth, 0);
    const totalCost = totalKwh * rate;
    const dailyCost = totalCost / 30;
    const yearlyCost = totalCost * 12;

    totalKwhEl.innerHTML = `<strong>${totalKwh.toFixed(1)}</strong>`;
    totalCostEl.innerHTML = `<strong>PKR ${numberWithCommas(totalCost.toFixed(0))}</strong>`;

    summaryUnits.textContent = `${totalKwh.toFixed(1)} kWh`;
    summaryDaily.textContent = `PKR ${numberWithCommas(dailyCost.toFixed(0))}`;
    summaryMonthly.textContent = `PKR ${numberWithCommas(totalCost.toFixed(0))}`;
    summaryYearly.textContent = `PKR ${numberWithCommas(yearlyCost.toFixed(0))}`;

    updateEfficiencyScore(totalKwh);
}

// ---- Efficiency Score ----
function updateEfficiencyScore(totalKwh) {
    // Score logic: lower usage = higher score
    // Average Pakistan household: ~300 kWh/month
    // Excellent: < 150, Good: 150-300, Average: 300-500, Poor: > 500
    let score;
    let label;
    let color;

    if (totalKwh <= 100) {
        score = 95; label = '🌟 Excellent! Ultra efficient!'; color = '#22c55e';
    } else if (totalKwh <= 200) {
        score = 85; label = '✅ Great! Very efficient household'; color = '#22c55e';
    } else if (totalKwh <= 300) {
        score = 70; label = '👍 Good, room for improvement'; color = '#84cc16';
    } else if (totalKwh <= 500) {
        score = 50; label = '⚠️ Average - AI tips can help!'; color = '#f59e0b';
    } else if (totalKwh <= 800) {
        score = 30; label = '🔴 High usage - review your appliances'; color = '#ef4444';
    } else {
        score = 15; label = '🚨 Very high! Urgent optimization needed'; color = '#dc2626';
    }

    scoreText.textContent = score;
    scoreText.style.color = color;
    scoreLabel.textContent = label;

    // Animate circle
    const circumference = 326.7;
    const offset = circumference - (score / 100) * circumference;
    scoreCircle.style.stroke = color;
    scoreCircle.style.strokeDashoffset = offset;
}

// ---- Delete Appliance ----
function deleteAppliance(id) {
    appliances = appliances.filter(a => a.id !== id);
    saveAppliances();
    renderAppliances();
}

// ---- Clear All ----
clearAllBtn.addEventListener('click', () => {
    if (confirm('Remove all appliances?')) {
        appliances = [];
        saveAppliances();
        renderAppliances();
    }
});

// ---- Rate Change ----
ratePerUnitInput.addEventListener('input', () => {
    renderAppliances();
});

// ---- Save to Local Storage ----
function saveAppliances() {
    localStorage.setItem('smartbijli_appliances', JSON.stringify(appliances));
}

// ---- Format Number ----
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ---- AI Analysis ----
analyzeBtn.addEventListener('click', async () => {
    apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        showApiStatus('Please enter your Gemini API key first!', 'error');
        apiKeyInput.focus();
        return;
    }

    if (appliances.length === 0) {
        alert('Please add at least one appliance first!');
        return;
    }

    const rate = parseFloat(ratePerUnitInput.value) || 35;
    const totalKwh = appliances.reduce((sum, a) => sum + a.kwhPerMonth, 0);
    const totalCost = totalKwh * rate;

    // Build prompt
    const applianceList = appliances.map(a => {
        return `- ${a.name}: ${a.watts}W × ${a.qty} units, ${a.hours} hours/day = ${a.kwhPerMonth.toFixed(1)} kWh/month (PKR ${(a.kwhPerMonth * rate).toFixed(0)})`;
    }).join('\n');

    const prompt = `You are SmartBijli, an AI electricity bill advisor for Pakistani households.

Analyze this household's electricity usage and provide detailed, actionable advice:

**Electricity Rate:** PKR ${rate}/kWh

**Appliances:**
${applianceList}

**Total Monthly Usage:** ${totalKwh.toFixed(1)} kWh
**Estimated Monthly Bill:** PKR ${totalCost.toFixed(0)}

Please provide:
1. **📊 Usage Analysis** - Break down which appliances consume the most and their percentage of total usage
2. **💡 Top 5 Saving Tips** - Specific, practical tips personalized to THESE appliances (not generic tips). Include estimated savings in PKR for each tip
3. **⚡ Quick Wins** - Things they can do TODAY to reduce their bill immediately
4. **🔄 Upgrade Recommendations** - If any appliances should be replaced with energy-efficient alternatives (e.g., inverter AC, LED lights)
5. **📉 Potential Savings** - Estimate how much they could save per month if they follow all your tips
6. **🌍 Environmental Impact** - Estimate CO2 reduction if they optimize their usage

Keep the tone friendly, use emojis, and make it easy to understand. Use PKR for all money amounts. Format your response with clear headings using markdown.`;

    // Show loading
    aiResponseCard.style.display = 'block';
    aiLoading.style.display = 'block';
    aiContent.innerHTML = '';
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

    // Scroll to AI response
    aiResponseCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response from AI. Please try again.');
        }

        aiLoading.style.display = 'none';
        aiContent.innerHTML = markdownToHtml(text);

    } catch (error) {
        aiLoading.style.display = 'none';
        aiContent.innerHTML = `
            <div style="color: #ef4444; padding: 20px; background: rgba(239,68,68,0.1); border-radius: 10px;">
                <strong>⚠️ Error:</strong> ${error.message}
                <br><br>
                <small>Make sure your API key is correct and you have an active internet connection.</small>
            </div>
        `;
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Get AI Analysis & Tips';
    }
});

// ---- Simple Markdown to HTML ----
function markdownToHtml(md) {
    let html = md
        // Escape HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Headers
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Unordered lists
        .replace(/^\* (.+)$/gm, '<li>$1</li>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr>')
        // Line breaks to paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Wrap in paragraph
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-4]>)/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

    // Wrap adjacent li elements in ul
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul><ul>/g, '');

    return html;
}

// ---- Shake Animation (CSS) ----
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ---- Smooth Scroll for Nav ----
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ---- Intersection Observer for Nav Active State ----
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active',
                    link.getAttribute('href') === `#${id}`
                );
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));
