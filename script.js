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
    const guideIcon = guideBtn.querySelector('.guide-icon');

    if (guideSection.style.display === 'none' || guideSection.style.display === '') {
        guideSection.style.display = 'block';
        guideSection.classList.add('fade-in');
        guideText.textContent = 'Hide Guide';
        if (guideIcon) guideIcon.textContent = '📖';
        guideSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        guideSection.style.display = 'none';
        guideText.textContent = 'Show Guide';
        if (guideIcon) guideIcon.textContent = '📖';
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

    const shuffledNames = [...names].sort(() => Math.random() - 0.5);

    teams = Array.from({
        length: numGroups
    }, (_, i) => ({
        name: `Team ${getTeamNameFromIndex(i)}`,
        members: []
    }));

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
                <div class="team-name" contenteditable="true" data-team-index="${teamIndex}">${team.name}</div>
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

        teamDiv.addEventListener('dragover', handleTeamDragOver);
        teamDiv.addEventListener('drop', handleTeamDrop);
        teamDiv.addEventListener('dragleave', handleTeamDragLeave);

        container.appendChild(teamDiv);
    });

    document.querySelectorAll('.team-name').forEach(nameDiv => {
        nameDiv.addEventListener('blur', (e) => {
            const newName = e.target.textContent.trim();
            const index = e.target.getAttribute('data-team-index');
            if (newName && index !== null) {
                teams[index].name = newName;
            } else {
                e.target.textContent = teams[index].name;
            }
        });

        nameDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });
    });

    const exportContainer = document.getElementById('exportContainer');
    if (teams.length > 0) {
        exportContainer.style.display = 'inline-block';
    } else {
        exportContainer.style.display = 'none';
    }

    const copyContainer = document.getElementById('copyContainer');
    if (teams.length > 0) {
        copyContainer.style.display = 'block';
    } else {
        copyContainer.style.display = 'none';
    }

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
    e.stopPropagation();

    if (e.target.classList.contains('member') && draggedElement && e.target !== draggedElement) {
        const targetTeam = parseInt(e.target.getAttribute('data-team'));
        const targetMember = parseInt(e.target.getAttribute('data-member'));
        const draggedMember = parseInt(draggedElement.getAttribute('data-member'));

        const temp = teams[draggedFromTeam].members[draggedMember];
        teams[draggedFromTeam].members[draggedMember] = teams[targetTeam].members[targetMember];
        teams[targetTeam].members[targetMember] = temp;

        renderTeams();
        return;
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

    if (e.target.classList.contains('member')) {
        return;
    }

    const targetTeam = parseInt(e.currentTarget.getAttribute('data-team'));

    if (draggedElement && draggedFromTeam !== targetTeam) {
        const draggedMember = parseInt(draggedElement.getAttribute('data-member'));
        const memberName = teams[draggedFromTeam].members[draggedMember];

        teams[draggedFromTeam].members.splice(draggedMember, 1);
        teams[targetTeam].members.push(memberName);

        renderTeams();
    }
    e.currentTarget.classList.remove('drag-over');
}

function handleDragLeave(e) {
    if (e.target.classList.contains('member')) {
        e.target.classList.remove('drag-over');
    }
}

function handleTeamDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        e.currentTarget.classList.remove('drag-over');
    }
}

function copyToClipboard() {
    if (!teams || teams.length === 0) {
        alert('No teams to copy! Please randomize teams first.');
        return;
    }

    let textToCopy = '';
    teams.forEach(team => {
        textToCopy += `${team.name}\n`;
        team.members.forEach(member => {
            textToCopy += `- ${member}\n`;
        });
        textToCopy += '\n';
    });

    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
        alert('Teams copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy teams. Please try again.');
    });
}


function exportToCSV() {
    if (!teams || teams.length === 0) {
        alert('No teams to export! Please randomize teams first.');
        return;
    }

    let csvContent = 'Team Name,Member Name,Member Number\n';

    teams.forEach(team => {
        if (team.members.length === 0) {
            csvContent += `"${team.name}","(No members)",0\n`;
        } else {
            team.members.forEach((member, index) => {
                csvContent += `"${team.name}","${member}",${index + 1}\n`;
            });
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const now = new Date();
        const filename = `team-randomizer-${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.csv`;

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        alert('CSV export is not supported in this browser. Please try using a modern browser.');
    }
}

function exportToPDF() {
    if (!teams || teams.length === 0) {
        alert('No teams to export! Please randomize teams first.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setProperties({
        title: 'Team Randomizer Results',
        subject: 'Randomized Teams',
        author: 'Team Randomizer',
        creator: 'Team Randomizer Web App'
    });

    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text('Team Randomizer Results', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const now = new Date();
    doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 20, 35);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
    doc.text(`Total Participants: ${totalMembers} | Number of Teams: ${teams.length}`, 20, 50);

    let yPosition = 70;

    teams.forEach((team, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text(team.name, 20, yPosition);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`(${team.members.length} members)`, 60, yPosition);

        yPosition += 10;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        team.members.forEach((member, memberIndex) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 30;
            }

            doc.text(`${memberIndex + 1}. ${member}`, 25, yPosition);
            yPosition += 8;
        });

        yPosition += 10;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by Team Randomizer - Page ${i} of ${pageCount}`, 20, 285);
    }

    const filename = `team-randomizer-${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.pdf`;
    doc.save(filename);
}