// ========== main.js ==========
// Lógica de interface do formulário de agendamento (serviço + data + horário)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('agendamentoForm')
    if (!form) return // esta página não é a de agendamento, encerra o script

    const calendarGrid = document.getElementById('calendarGrid')
    const calendarMonthLabel = document.getElementById('calendarMonthLabel')
    const prevMonthBtn = document.getElementById('prevMonth')
    const nextMonthBtn = document.getElementById('nextMonth')
    const dataInput = document.getElementById('dataInput')
    const timeSlotsWrapper = document.getElementById('timeSlots')
    const horaInput = document.getElementById('horaInput')
    const submitBtn = document.getElementById('submitBtn')
    const formError = document.getElementById('formError')

    // quando não há serviços cadastrados, a escolha de serviço vira opcional
    const radios = form.querySelectorAll('.service-radio')
    const temServicos = form.getAttribute('data-tem-servicos') === 'true' && radios.length > 0

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    const horariosDisponiveis = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30'
    ]

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    let anoAtual = hoje.getFullYear()
    let mesAtual = hoje.getMonth()

    function formatarData(ano, mes, dia) {
        const mesFormatado = String(mes + 1).padStart(2, '0')
        const diaFormatado = String(dia).padStart(2, '0')
        return `${ano}-${mesFormatado}-${diaFormatado}`
    }

    function limparErro() {
        if (formError) formError.textContent = ''
    }

    function servicoValido() {
        if (!temServicos) return true
        return Boolean(form.querySelector('.service-radio:checked'))
    }

    function atualizarBotaoSubmit() {
        const habilitar = servicoValido() && Boolean(dataInput.value) && Boolean(horaInput.value)
        submitBtn.disabled = !habilitar
        if (habilitar) limparErro()
    }

    function renderizarCalendario() {
        calendarGrid.innerHTML = ''
        calendarMonthLabel.textContent = `${meses[mesAtual]} ${anoAtual}`

        const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay()
        const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate()

        for (let i = 0; i < primeiroDiaSemana; i++) {
            const vazio = document.createElement('span')
            vazio.className = 'calendar-day empty'
            calendarGrid.appendChild(vazio)
        }

        for (let dia = 1; dia <= totalDiasNoMes; dia++) {
            const dataDoDia = new Date(anoAtual, mesAtual, dia)
            dataDoDia.setHours(0, 0, 0, 0)
            const valorData = formatarData(anoAtual, mesAtual, dia)

            const botaoDia = document.createElement('button')
            botaoDia.type = 'button'
            botaoDia.className = 'calendar-day'
            botaoDia.textContent = String(dia)
            botaoDia.setAttribute('data-value', valorData)

            const passado = dataDoDia < hoje
            if (passado) {
                botaoDia.classList.add('disabled')
                botaoDia.disabled = true
            }

            if (dataDoDia.getTime() === hoje.getTime()) {
                botaoDia.classList.add('today')
            }

            if (dataInput.value === valorData) {
                botaoDia.classList.add('selected')
            }

            botaoDia.addEventListener('click', () => {
                calendarGrid.querySelectorAll('.calendar-day.selected').forEach((el) => el.classList.remove('selected'))
                botaoDia.classList.add('selected')
                dataInput.value = valorData
                limparErro()
                atualizarBotaoSubmit()
            })

            calendarGrid.appendChild(botaoDia)
        }

        if (prevMonthBtn) {
            const eMesAtual = (anoAtual === hoje.getFullYear() && mesAtual === hoje.getMonth())
            prevMonthBtn.disabled = eMesAtual
        }
    }

    function renderizarHorarios() {
        timeSlotsWrapper.innerHTML = ''
        horariosDisponiveis.forEach((horario) => {
            const botaoHorario = document.createElement('button')
            botaoHorario.type = 'button'
            botaoHorario.className = 'time-slot'
            botaoHorario.textContent = horario
            botaoHorario.setAttribute('data-value', horario)

            if (horaInput.value === horario) {
                botaoHorario.classList.add('selected')
            }

            botaoHorario.addEventListener('click', () => {
                timeSlotsWrapper.querySelectorAll('.time-slot.selected').forEach((el) => el.classList.remove('selected'))
                botaoHorario.classList.add('selected')
                horaInput.value = horario
                limparErro()
                atualizarBotaoSubmit()
            })

            timeSlotsWrapper.appendChild(botaoHorario)
        })
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            mesAtual -= 1
            if (mesAtual < 0) {
                mesAtual = 11
                anoAtual -= 1
            }
            renderizarCalendario()
        })
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            mesAtual += 1
            if (mesAtual > 11) {
                mesAtual = 0
                anoAtual += 1
            }
            renderizarCalendario()
        })
    }

    radios.forEach((radio) => {
        radio.addEventListener('change', () => {
            limparErro()
            atualizarBotaoSubmit()
        })
    })

    form.addEventListener('submit', (evento) => {
        if (!servicoValido()) {
            evento.preventDefault()
            if (formError) formError.textContent = 'Selecione um serviço antes de agendar.'
            return
        }

        if (!dataInput.value || !horaInput.value) {
            evento.preventDefault()
            if (formError) formError.textContent = 'Selecione a data e o horário antes de agendar.'
            return
        }

        submitBtn.disabled = true
        submitBtn.value = 'Agendando...'
    })

    renderizarCalendario()
    renderizarHorarios()
    atualizarBotaoSubmit()
})