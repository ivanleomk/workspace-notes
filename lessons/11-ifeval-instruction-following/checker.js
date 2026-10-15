// Interactive constraint checker for IFEval lesson

function checkConstraints() {
    const input = document.getElementById('checker-input').value;
    const results = document.getElementById('checker-results');
    
    // Get active constraints
    const constraints = {
        words: document.getElementById('constraint-words').checked,
        keyword: document.getElementById('constraint-keyword').checked,
        bullets: document.getElementById('constraint-bullets').checked,
        postscript: document.getElementById('constraint-postscript').checked
    };
    
    // Run verifications
    const verifications = {
        words: verifyWordCount(input, 50, 100),
        keyword: verifyKeywordFrequency(input, 'machine learning', 2),
        bullets: verifyBulletCount(input, 3),
        postscript: verifyPostscript(input, 'P.S. Thank you!')
    };
    
    // Display results
    let html = '<h4>Verification Results:</h4><div class="verification-results">';
    
    if (constraints.words) {
        html += formatVerificationResult(
            'Word Count (50-100 words)',
            verifications.words,
            `Found ${verifications.words.count} words`
        );
    }
    
    if (constraints.keyword) {
        html += formatVerificationResult(
            'Keyword Frequency ("machine learning" ≥2 times)',
            verifications.keyword,
            `Found ${verifications.keyword.count} occurrences`
        );
    }
    
    if (constraints.bullets) {
        html += formatVerificationResult(
            'Bullet Points (exactly 3)',
            verifications.bullets,
            `Found ${verifications.bullets.count} bullet points`
        );
    }
    
    if (constraints.postscript) {
        html += formatVerificationResult(
            'Postscript ("P.S. Thank you!")',
            verifications.postscript,
            verifications.postscript.message
        );
    }
    
    html += '</div>';
    
    // Add explanation of strict vs loose
    html += '<div class="checker-explanation">';
    html += '<h4>Understanding Strict vs Loose Verification:</h4>';
    html += '<p><strong>Strict:</strong> Exact matching with minimal tolerance (e.g., exact string match for postscript, precise counts)</p>';
    html += '<p><strong>Loose:</strong> Applies transformations before checking (removes markdown, punctuation, case normalization) to reduce false negatives</p>';
    html += '<p>Try adding markdown formatting or punctuation to see how loose verification is more forgiving!</p>';
    html += '</div>';
    
    results.innerHTML = html;
    results.style.display = 'block';
}

function formatVerificationResult(label, verification, details) {
    const strictClass = verification.strict ? 'pass' : 'fail';
    const looseClass = verification.loose ? 'pass' : 'fail';
    
    return `
        <div class="verification-item">
            <div class="verification-label">${label}</div>
            <div class="verification-details">${details}</div>
            <div class="verification-status">
                <span class="status-badge ${strictClass}">
                    Strict: ${verification.strict ? '✓ Pass' : '✗ Fail'}
                </span>
                <span class="status-badge ${looseClass}">
                    Loose: ${verification.loose ? '✓ Pass' : '✗ Fail'}
                </span>
            </div>
        </div>
    `;
}

function verifyWordCount(text, min, max) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    const strict = count >= min && count <= max;
    
    // Loose: slightly more tolerant range (±5 words)
    const loose = count >= (min - 5) && count <= (max + 5);
    
    return { strict, loose, count };
}

function verifyKeywordFrequency(text, keyword, minCount) {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    // Count occurrences
    let count = 0;
    let pos = 0;
    while ((pos = lowerText.indexOf(lowerKeyword, pos)) !== -1) {
        count++;
        pos += lowerKeyword.length;
    }
    
    const strict = count >= minCount;
    
    // Loose: allow ±1 occurrence
    const loose = count >= (minCount - 1);
    
    return { strict, loose, count };
}

function verifyBulletCount(text, targetCount) {
    // Count lines starting with bullet markers
    const lines = text.split('\n');
    const bulletCount = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('+') || /^\d+\./.test(trimmed);
    }).length;
    
    const strict = bulletCount === targetCount;
    
    // Loose: allow ±1 bullet
    const loose = Math.abs(bulletCount - targetCount) <= 1;
    
    return { strict, loose, count: bulletCount };
}

function verifyPostscript(text, targetPostscript) {
    const lines = text.trim().split('\n');
    const lastLine = lines[lines.length - 1].trim();
    
    // Strict: exact match
    const strict = lastLine === targetPostscript;
    
    // Loose: normalize and compare
    const normalizedLast = normalizePunctuation(lastLine.toLowerCase());
    const normalizedTarget = normalizePunctuation(targetPostscript.toLowerCase());
    const loose = normalizedLast === normalizedTarget || normalizedLast.includes(normalizedTarget);
    
    const message = strict ? 'Exact match' : 
                    loose ? 'Match after normalization' : 
                    `Expected "${targetPostscript}", got "${lastLine}"`;
    
    return { strict, loose, message };
}

function normalizePunctuation(text) {
    // Remove markdown, extra spaces, and some punctuation for loose matching
    return text
        .replace(/\*\*/g, '')  // Remove bold markdown
        .replace(/\*/g, '')    // Remove italic markdown
        .replace(/[_~`]/g, '') // Remove other markdown
        .replace(/\s+/g, ' ')  // Normalize spaces
        .trim();
}

// Add some helpful examples
function loadExample(exampleNum) {
    const examples = {
        1: `Machine learning is transforming the world. Key applications include:

* Image recognition
* Natural language processing  
* Autonomous vehicles

These machine learning systems continue to improve with more data.`,
        2: `The field of machine learning has revolutionized artificial intelligence. Modern machine learning algorithms can:

* Process vast amounts of data quickly
* Identify complex patterns humans might miss
* Adapt and improve over time
* Make predictions with increasing accuracy

Machine learning continues to advance at a rapid pace.`,
        3: `Artificial intelligence and machine learning are closely related fields. Benefits include automated decision-making, pattern recognition, and predictive analytics. Machine learning powers many modern applications.

P.S. Thank you!`
    };
    
    const input = document.getElementById('checker-input');
    if (input && examples[exampleNum]) {
        input.value = examples[exampleNum];
    }
}
