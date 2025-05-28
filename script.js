

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultDisplay = document.getElementById('resultDisplay');
    const totalWords = document.getElementById('totalWords');
    const nounCount = document.getElementById('nounCount');
    const verbCount = document.getElementById('verbCount');
    const adjCount = document.getElementById('adjCount');
    const advCount = document.getElementById('advCount');

    // Map of word types to their CSS classes
    const wordTypeClasses = {
        'noun': 'noun',
        'verb': 'verb',
        'adj': 'adj',
        'adv': 'adv',
        'pron': 'pron',
        'prep': 'prep',
        'conj': 'conj',
        'num': 'num',
        'part': 'part',
        'unk': 'unk'
    };

    // Map of word types to their Vietnamese labels
    const wordTypeLabels = {
        'noun': 'Danh từ',
        'verb': 'Động từ',
        'adj': 'Tính từ',
        'adv': 'Trạng từ',
        'pron': 'Đại từ',
        'prep': 'Giới từ',
        'conj': 'Liên từ',
        'num': 'Số từ',
        'part': 'Trợ từ',
        'unk': 'Không xác định'
    };

    // Event listeners
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearAll);
    textInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            analyzeText();
        }
    });

    // Function to analyze text (this would connect to your backend in the real implementation)
    function analyzeText() {
        const text = textInput.value.trim();
        
        if (!text) {
            showPlaceholder('Vui lòng nhập văn bản để phân tích.');
            return;
        }

        showPlaceholder('Đang phân tích...');

        fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API phân tích');
            }
            return response.json();
        })
        .then(result => {
            displayResults(result);
        })
        .catch(error => {
            showPlaceholder('Có lỗi xảy ra khi phân tích: ' + error.message);
        });
    }


    // Function to display analysis results
    function displayResults(analyzedWords) {
        if (!analyzedWords || analyzedWords.length === 0) {
            showPlaceholder('Không có kết quả phân tích.');
            return;
        }

        // Clear previous results
        resultDisplay.innerHTML = '';
        
        // Create HTML for analyzed words
        const resultHTML = analyzedWords.map(item => {
            const wordClass = wordTypeClasses[item.type] || 'unk';
            const wordLabel = wordTypeLabels[item.type] || 'Không xác định';
            
            return `<span class="word ${wordClass}">
                ${item.word}
                <span class="word-tag ${wordClass}">${wordLabel}</span>
            </span>`;
        }).join(' ');
        
        resultDisplay.innerHTML = resultHTML;
        
        // Update statistics
        updateStatistics(analyzedWords);
    }

    // Function to update statistics
    function updateStatistics(analyzedWords) {
        const counts = {
            'total': analyzedWords.length,
            'noun': 0,
            'verb': 0,
            'adj': 0,
            'adv': 0
        };
        
        // Count word types
        analyzedWords.forEach(item => {
            if (counts.hasOwnProperty(item.type)) {
                counts[item.type]++;
            }
        });
        
        // Update UI
        totalWords.textContent = counts.total;
        nounCount.textContent = counts.noun;
        verbCount.textContent = counts.verb;
        adjCount.textContent = counts.adj;
        advCount.textContent = counts.adv;
    }

    // Function to show placeholder text
    function showPlaceholder(message) {
        resultDisplay.innerHTML = `<p class="placeholder-text">${message}</p>`;
        
        // Reset statistics
        totalWords.textContent = '0';
        nounCount.textContent = '0';
        verbCount.textContent = '0';
        adjCount.textContent = '0';
        advCount.textContent = '0';
    }

    // Function to clear all inputs and results
    function clearAll() {
        textInput.value = '';
        showPlaceholder('Kết quả phân loại sẽ hiển thị ở đây...');
    }

    // Initialize with placeholder
    showPlaceholder('Kết quả phân loại sẽ hiển thị ở đây...');
});
