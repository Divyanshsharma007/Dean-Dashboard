/* ── Theme Toggle ──────────────────────────────────────────────── */

const html = document.documentElement;

document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

/* ── Progress Tracker ──────────────────────────────────────────── */

const SECTION_FIELDS = {
    personal:  ['age', 'gender', 'nationality', 'residence_type', 'commute_distance_km'],
    academic:  ['department', 'admission_type', 'highschool_score',
                'entrance_exam_score_normalized', 'attendance_pct',
                'current_sem_cgpa', 'aggregate_cgpa', 'backlogs_count'],
    financial: ['family_income_bracket', 'parent_education',
                'scholarship_status', 'fee_payment_status'],
};

function isFilled(id) {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
}

function updateProgress() {
    const allFields = Object.values(SECTION_FIELDS).flat();
    const filled    = allFields.filter(isFilled).length;
    const pct       = Math.round((filled / allFields.length) * 100);

    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressValue').textContent = pct + '%';

    const progressBar = document.querySelector('.progress-track');
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', pct);
    }

    for (const [section, fields] of Object.entries(SECTION_FIELDS)) {
        const done = fields.every(isFilled);
        const el   = document.querySelector(`.section-check[data-section="${section}"]`);
        if (el) el.classList.toggle('done', done);
    }
}

document.querySelectorAll('.field-input').forEach(el => {
    el.addEventListener('input',  updateProgress);
    el.addEventListener('change', () => {
        updateProgress();
        if (el.value.trim()) {
            el.classList.add('has-value');
            el.classList.remove('error');
        } else {
            el.classList.remove('has-value');
        }
    });
});

/* ── Form Reset ────────────────────────────────────────────────── */

function resetForm() {
    document.querySelectorAll('.field-input').forEach(el => {
        el.value = '';
        el.classList.remove('has-value', 'error');
    });
    updateProgress();

    const result = document.getElementById('result');
    if (!result.hidden) {
        result.style.animation = 'none';
        result.hidden = true;
    }
}

/* ── Validation ────────────────────────────────────────────────── */

function validateFields() {
    const allFields = Object.values(SECTION_FIELDS).flat().concat(['commute_distance_km']);
    let valid = true;

    document.querySelectorAll('.field-input').forEach(el => el.classList.remove('error'));

    for (const id of allFields) {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
            el.classList.add('error');
            valid = false;
        }
    }

    return valid;
}

/* ── Predict ───────────────────────────────────────────────────── */

async function predictDropout() {
    if (!validateFields()) {
        const firstError = document.querySelector('.field-input.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    const btn = document.getElementById('predictBtn');
    btn.classList.add('loading');
    btn.querySelector('.btn-text').textContent = 'Analysing...';

    const data = {
        age:                              parseInt(document.getElementById('age').value),
        gender:                           document.getElementById('gender').value,
        nationality:                      document.getElementById('nationality').value,
        highschool_score:                 parseFloat(document.getElementById('highschool_score').value),
        entrance_exam_score_normalized:   parseFloat(document.getElementById('entrance_exam_score_normalized').value),
        department:                       parseInt(document.getElementById('department').value),
        admission_type:                   document.getElementById('admission_type').value,
        attendance_pct:                   parseFloat(document.getElementById('attendance_pct').value),
        current_sem_cgpa:                 parseFloat(document.getElementById('current_sem_cgpa').value),
        aggregate_cgpa:                   parseFloat(document.getElementById('aggregate_cgpa').value),
        backlogs_count:                   parseInt(document.getElementById('backlogs_count').value),
        family_income_bracket:            document.getElementById('family_income_bracket').value,
        parent_education:                 document.getElementById('parent_education').value,
        scholarship_status:               document.getElementById('scholarship_status').value,
        fee_payment_status:               document.getElementById('fee_payment_status').value,
        residence_type:                   document.getElementById('residence_type').value,
        commute_distance_km:              parseFloat(document.getElementById('commute_distance_km').value),
    };

    try {
        const response = await fetch('http://127.0.0.1:8001/predict', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const result = await response.json();
        renderResult(result);

    } catch (error) {
        console.error(error);
        showError(error.message.includes('Server error')
            ? 'The server returned an error. Please check your input and try again.'
            : 'Could not connect to the prediction backend. Ensure the server is running on port 8001.');
    } finally {
        btn.classList.remove('loading');
        btn.querySelector('.btn-text').textContent = 'Run Risk Assessment';
    }
}

/* ── Render Result ─────────────────────────────────────────────── */

function renderResult(result) {
    const pct = (result.dropout_probability * 100).toFixed(1);
    const val = parseFloat(pct);

    /* Thresholds: <50 low, 50-75 medium, >75 high */
    const isHigh = val >= 75;
    const isMid  = val >= 50;

    /* Verdict label from raw API value */
    const isDropout = result.prediction.toLowerCase().includes('dropout') &&
                      !result.prediction.toLowerCase().includes('not');
    const verdictText = isDropout ? 'Dropout Risk' : 'No Dropout Risk';

    /* Color token for bar and percentage text */
    const colorVar = isHigh ? 'var(--high)' : isMid ? 'var(--mid)' : 'var(--low)';
    const noteColor = isHigh ? 'var(--high)' : isMid ? 'var(--mid)' : 'var(--low)';

    const panel      = document.getElementById('result');
    const icon       = document.getElementById('resultIcon');
    const prediction = document.getElementById('prediction');
    const dropoutBar = document.getElementById('dropoutBar');
    const dropoutPct = document.getElementById('dropout_probability');
    const note       = document.getElementById('resultNote');

    /* Icon state */
    icon.className = 'result-icon';
    if (isHigh)     icon.classList.add('risk-high');
    else if (isMid) icon.classList.add('risk-mid');

    icon.innerHTML = isDropout
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

    prediction.textContent = verdictText;
    prediction.style.color = colorVar;

    dropoutPct.textContent = pct + '%';
    dropoutPct.style.color = colorVar;
    dropoutBar.style.background = colorVar;

    panel.hidden = false;
    panel.style.animation = 'none';
    requestAnimationFrame(() => {
        panel.style.animation = '';
        requestAnimationFrame(() => {
            dropoutBar.style.width = pct + '%';
        });
    });

    if (isHigh) {
        note.textContent = 'High dropout risk detected. Immediate intervention is recommended — consider academic counselling, financial aid review, and increased mentor engagement.';
    } else if (isMid) {
        note.textContent = 'Moderate risk level. Proactive monitoring and periodic check-ins with the student advisor are advised to prevent deterioration.';
    } else {
        note.textContent = 'Low dropout risk. The student profile appears stable. Continue regular academic monitoring as a precautionary measure.';
    }
    note.style.borderLeftColor = noteColor;

    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Error Toast ───────────────────────────────────────────────── */

function showError(msg) {
    const existing = document.getElementById('errorToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'errorToast';
    toast.setAttribute('role', 'alert');
    Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '28px',
        right:        '28px',
        background:   'var(--high-bg)',
        color:        'var(--high)',
        border:       '1px solid var(--high)',
        borderRadius: 'var(--radius)',
        padding:      '14px 18px',
        fontSize:     '13px',
        fontFamily:   'var(--font)',
        maxWidth:     '360px',
        lineHeight:   '1.5',
        zIndex:       '9999',
        boxShadow:    'var(--shadow)',
        animation:    'slideUp 0.3s ease',
    });
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 6000);
}

/* ── Init ──────────────────────────────────────────────────────── */

updateProgress();