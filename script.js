let teams = [];
let draggedElement = null;
let draggedFromTeam = null;

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('teamRandomizerTheme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        updateThemeIcon();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('teamRandomizerTheme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    const isDark = document.body.classList.contains('dark');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Guide toggle functionality
function toggleGuide() {
    const guideSection = document.getElementById('guideSection');
    const guideBtn = document.getElementById('guideBtn');
    const guideText = guideBtn.querySelector('.guide-text');
    const guideIcon = guideBtn.querySelector('.guide-icon'); // Note: guide-icon class doesn't exist in HTML

    if (guideSection.style.display === 'none' || guideSection.style.display === '') {
        guideSection.style.display = 'block';
        guideSection.classList.add('fade-in');
        guideText.textContent = 'Hide Guide';
        if (guideIcon) guideIcon.textContent = '📖'; // Check if element exists
        guideSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        guideSection.style.display = 'none';
        guideText.textContent = 'Show Guide';
        if (guideIcon) guideIcon.textContent = '📖'; // Check if element exists
    }
}


function getTeamNameFromIndex(index) {
    let teamName = '';
    let num = index + 1;
    while (num > 0) {
        let remainder = (num - 1) % 26;
        teamName = String.fromCharCode(65 + remainder) + teamName;
        num = Math.floor((num - 1) / 26);
    }
    return teamName;
}

function randomizeTeams() {
    const namesText = document.getElementById('names').value.trim();
    const numGroups = parseInt(document.getElementById('groups').value);

    if (!namesText) {
        alert('Please enter some names!');
        return;
    }

    if (numGroups < 2) {
        alert('Please enter at least 2 teams!');
        return;
    }

    const names = namesText.split('\n').filter(name => name.trim() !== '');

    if (names.length < numGroups) {
        alert('You need at least as many names as teams!');
        return;
    }

    // Shuffle names
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);

    // Initialize teams
    teams = Array.from({
        length: numGroups
    }, (_, i) => ({
        name: `Team ${getTeamNameFromIndex(i)}`,
        members: []
    }));

    // Distribute names evenly
    shuffledNames.forEach((name, index) => {
        const teamIndex = index % numGroups;
        teams[teamIndex].members.push(name.trim());
    });

    renderTeams();
}

function renderTeams() {
    const container = document.getElementById('teamsContainer');
    container.innerHTML = '';

    teams.forEach((team, teamIndex) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team fade-in';
        teamDiv.setAttribute('data-team', teamIndex);

        teamDiv.innerHTML = `
            <div class="team-header">
                <div class="team-name">${team.name}</div>
                <div class="team-count">${team.members.length} members</div>
            </div>
            <div class="members-list">
                ${team.members.length > 0
                    ? team.members.map((member, memberIndex) => `
                        <div class="member"
                            draggable="true"
                            data-team="${teamIndex}"
                            data-member="${memberIndex}"
                            ondragstart="handleDragStart(event)"
                            ondragend="handleDragEnd(event)"
                            ondragover="handleDragOver(event)"
                            ondragleave="handleDragLeave(event)"
                            ondrop="handleDrop(event)">
                            ${member}
                        </div>
                    `).join('')
                    : '<div class="empty-state">No members yet</div>'
                }
            </div>
        `;

        // Add team drop listeners
        teamDiv.addEventListener('dragover', handleTeamDragOver);
        teamDiv.addEventListener('drop', handleTeamDrop);
        teamDiv.addEventListener('dragleave', handleTeamDragLeave);

        container.appendChild(teamDiv);
    });
}

function handleDragStart(e) {
    draggedElement = e.target;
    draggedFromTeam = parseInt(e.target.getAttribute('data-team'));
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
    draggedElement = null;
    draggedFromTeam = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (e.target.classList.contains('member')) {
        e.target.classList.add('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to team handler

    if (e.target.classList.contains('member') && draggedElement && e.target !== draggedElement) {
        // Swap members
        const targetTeam = parseInt(e.target.getAttribute('data-team'));
        const targetMember = parseInt(e.target.getAttribute('data-member'));
        const draggedMember = parseInt(draggedElement.getAttribute('data-member'));

        // Swap the members
        const temp = teams[draggedFromTeam].members[draggedMember];
        teams[draggedFromTeam].members[draggedMember] = teams[targetTeam].members[targetMember];
        teams[targetTeam].members[targetMember] = temp;

        renderTeams();
        return; // Exit early to prevent team drop handler
    }
    e.target.classList.remove('drag-over');
}

function handleTeamDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleTeamDrop(e) {
    e.preventDefault();

    // Only handle if the drop target is the team container itself, not a member
    if (e.target.classList.contains('member')) {
        return; // Let the member drop handler handle this
    }

    const targetTeam = parseInt(e.currentTarget.getAttribute('data-team'));

    if (draggedElement && draggedFromTeam !== targetTeam) {
        const draggedMember = parseInt(draggedElement.getAttribute('data-member'));
        const memberName = teams[draggedFromTeam].members[draggedMember];

        // Remove from original team
        teams[draggedFromTeam].members.splice(draggedMember, 1);

        // Add to target team
        teams[targetTeam].members.push(memberName);

        renderTeams();
    }
    e.currentTarget.classList.remove('drag-over');
}

function handleDragLeave(e) {
    // Remove drag-over class when leaving a member
    if (e.target.classList.contains('member')) {
        e.target.classList.remove('drag-over');
    }
}

function handleTeamDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        e.currentTarget.classList.remove('drag-over');
    }
}