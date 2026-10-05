// Real GSM8K problems
// Data sourced from https://github.com/openai/grade-school-math and
// https://huggingface.co/datasets/openai/gsm8k

const gsm8kProblems = {
    simple: [
        {
            question: "Natalia sold clips to 48 of her friends in April, and then she sold half as many clips in May. How many clips did Natalia sell altogether in April and May?",
            solution: "Natalia sold 48/2 = 24 clips in May.\nNatalia sold 48+24 = 72 clips altogether in April and May.\n#### 72",
            answer: "72",
            steps: 2
        },
        {
            question: "There are 15 trees in the grove. Grove workers will plant trees in the grove today. After they are done, there will be 21 trees. How many trees did the grove workers plant today?",
            solution: "There are 15 trees originally.\nThen there were 21 trees after some more were planted.\nSo there must have been 21 - 15 = 6 trees planted.\n#### 6",
            answer: "6",
            steps: 2
        },
        {
            question: "If there are 3 cars in the parking lot and 2 more cars arrive, how many cars are in the parking lot?",
            solution: "There are originally 3 cars.\n2 more cars arrive.\n3 + 2 = 5 cars.\n#### 5",
            answer: "5",
            steps: 2
        },
        {
            question: "Janet's ducks lay 16 eggs per day. She eats three for breakfast every morning and bakes muffins for her friends every day with four. She sells the remainder at the farmers' market daily for $2 per fresh duck egg. How much in dollars does she make every day at the farmers' market?",
            solution: "Janet sells 16 - 3 - 4 = 9 duck eggs a day.\nShe makes 9 * 2 = $18 every day at the farmer's market.\n#### 18",
            answer: "18",
            steps: 3
        }
    ],
    complex: [
        {
            question: "A robe takes 2 bolts of blue fiber and half that much white fiber. How many bolts in total does it take?",
            solution: "It takes 2/2=1 bolt of white fiber.\nSo the total amount of fabric is 2+1=3 bolts of fiber.\n#### 3",
            answer: "3",
            steps: 2
        },
        {
            question: "Josh decides to try flipping a house. He buys a house for $80,000 and then puts in $50,000 in repairs. This increased the value of the house by 150%. How much profit did he make?",
            solution: "The cost of the house and repairs came out to 80,000+50,000=$130,000.\nHe increased the value of the house by 80,000*1.5=120,000.\nSo the new value of the house is 80,000+120,000=$200,000.\nSo he made a profit of 200,000-130,000=$70,000.\n#### 70000",
            answer: "70000",
            steps: 4
        },
        {
            question: "James decides to run 3 sprints 3 times a week. He runs 60 meters each sprint. How many total meters does he run a week?",
            solution: "He sprints 3*3=9 times a week.\nSo he runs 9*60=540 meters.\n#### 540",
            answer: "540",
            steps: 3
        },
        {
            question: "Carla is downloading a 200 GB file. Normally she can download 2 GB/minute, but 40% of the way through the download, Windows forces a restart to install updates, which takes 20 minutes. Then Carla has to restart the download from the beginning. How load does it take to download the file?",
            solution: "First find how many gigabytes are in 40% of the file: 200 GB * 40% = 80 GB.\nThen divide that number by the download rate to find the time until Windows restarts: 80 GB / 2 GB/minute = 40 minutes.\nThen find the time to download the whole file after the restart: 200 GB / 2 GB/minute = 100 minutes.\nThen add the time to download 40% of the file, to the restart time, to the time to download the whole file: 40 minutes + 20 minutes + 100 minutes = 160 minutes.\n#### 160",
            answer: "160",
            steps: 5
        },
        {
            question: "John takes care of 10 dogs. Each dog takes .5 hours a day to walk and take care of their business. How many hours a week does he spend taking care of dogs?",
            solution: "He spends 10*.5=5 hours per day.\nThat means he spends 5*7=35 hours per week.\n#### 35",
            answer: "35",
            steps: 3
        },
        {
            question: "Gretchen has 110 coins. There are 30 more gold coins than silver coins. How many gold coins does Gretchen have?",
            solution: "Let x be the number of silver coins Gretchen has.\nGretchen has x+30 gold coins.\nx+x+30=110\n2*x=80\nx=40\nGretchen has 40+30=70 gold coins.\n#### 70",
            answer: "70",
            steps: 5
        }
    ]
};

function displayProblems(category) {
    const problemDisplay = document.getElementById('problem-display');
    problemDisplay.innerHTML = '';
    
    let problems = [];
    if (category === 'simple') {
        problems = gsm8kProblems.simple;
    } else if (category === 'complex') {
        problems = gsm8kProblems.complex;
    } else {
        problems = [...gsm8kProblems.simple, ...gsm8kProblems.complex];
    }
    
    problems.forEach((problem, idx) => {
        const problemDiv = document.createElement('div');
        problemDiv.className = 'sample-question';
        
        const difficulty = problem.steps <= 2 ? 'Simple' : problem.steps <= 4 ? 'Medium' : 'Complex';
        
        problemDiv.innerHTML = `
            <h4>Problem ${idx + 1} (${difficulty} - ${problem.steps} steps)</h4>
            <p class="question-text"><strong>Question:</strong> ${problem.question}</p>
            <div class="solution-box">
                <p><strong>Solution:</strong></p>
                <pre>${problem.solution}</pre>
            </div>
            <div class="answer"><strong>Final Answer:</strong> ${problem.answer}</div>
        `;
        
        problemDisplay.appendChild(problemDiv);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProblems('all');
    
    document.getElementById('show-easy').addEventListener('click', () => displayProblems('simple'));
    document.getElementById('show-hard').addEventListener('click', () => displayProblems('complex'));
    document.getElementById('show-all').addEventListener('click', () => displayProblems('all'));
});
