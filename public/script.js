document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const scheduleTable = document.getElementById('schedule');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');

    scheduleTable.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD' && event.target.cellIndex > 0) {
            const name = nameInput.value.trim();
            if (name) {
                event.target.textContent = name;
            } else {
                alert('Lütfen isim girin.');
            }
        }
    });

    saveButton.addEventListener('click', async () => {
        const schedule = [];
        for (let i = 1; i < scheduleTable.rows.length; i++) {
            const row = scheduleTable.rows[i];
            for (let j = 1; j < row.cells.length; j++) {
                if (row.cells[j].textContent) {
                    schedule.push({
                        time: row.cells[0].textContent,
                        day: scheduleTable.rows[0].cells[j].textContent,
                        name: row.cells[j].textContent
                    });
                }
            }
        }

        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(schedule)
            });

            if (response.ok) {
                alert('Program kaydedildi.');
            } else {
                alert('Program kaydedilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Program kaydedilirken bir hata oluştu.');
        }
    });

    clearButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/clear', {
                method: 'POST'
            });

            if (response.ok) {
                for (let i = 1; i < scheduleTable.rows.length; i++) {
                    const row = scheduleTable.rows[i];
                    for (let j = 1; j < row.cells.length; j++) {
                        row.cells[j].textContent = '';
                    }
                }
                alert('Program temizlendi.');
            } else {
                alert('Program temizlenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Program temizlenirken bir hata oluştu.');
        }
    });

    async function loadSchedule() {
        try {
            const response = await fetch('/api/load');
            const schedule = await response.json();

            for (const entry of schedule) {
                for (let i = 1; i < scheduleTable.rows.length; i++) {
                    const row = scheduleTable.rows[i];
                    if (row.cells[0].textContent === entry.time) {
                        for (let j = 1; j < row.cells.length; j++) {
                            if (scheduleTable.rows[0].cells[j].textContent === entry.day) {
                                row.cells[j].textContent = entry.name;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Program yüklenirken bir hata oluştu.');
        }
    }

    loadSchedule();
});
