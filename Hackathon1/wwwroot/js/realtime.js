(function () {
    'use strict';

    if (typeof signalR === 'undefined') return;

    var connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/notifications')
        .build();

    // Handle incoming weather updates (Ciudadano dashboard)
    connection.on('WeatherUpdated', function (weather) {
        function setText(id, value) {
            var el = document.getElementById(id);
            if (el && value !== undefined && value !== null) el.textContent = value;
        }

        setText('rt-provincia', weather.provincia);
        if (weather.fecha) {
            var d = new Date(weather.fecha);
            setText('rt-fecha', d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }));
        }
        setText('rt-tmax', weather.tmax);
        setText('rt-horatmax', weather.horaTmax);
        setText('rt-tmin', weather.tmin);
        setText('rt-horatmin', weather.horaTmin);
        setText('rt-tmed', weather.tmed);
        setText('rt-prec', weather.prec);
        setText('rt-hrmedia', weather.hrMedia);
        setText('rt-racha', weather.racha);
        setText('rt-horaracha', weather.horaracha);
        setText('rt-velmedia', weather.velmedia);
        setText('rt-dir', weather.dir);
        setText('rt-sol', weather.sol);
        setText('rt-presmax', weather.presMax);
        setText('rt-horapresmax', weather.horaPresMax);
        setText('rt-presmin', weather.presMin);
        setText('rt-horapresmin', weather.horaPresMin);
        if (weather.altitud !== undefined && weather.altitud !== null) {
            setText('rt-altitud', weather.altitud);
        }
    });

    // Handle incoming alert notifications (Backoffice panel and Ciudadano)
    function handleAlert(alert) {
        var list = document.getElementById('alerts-list');
        if (list) {
            // Remove placeholder if present
            var placeholder = document.getElementById('no-alerts-placeholder');
            if (placeholder) placeholder.remove();

            var now = new Date(alert.createdAt || new Date());
            var dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                + ' ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            var li = document.createElement('li');
            li.className = 'list-group-item';
            var badgeClass = alert.isActive ? 'bg-success' : 'bg-secondary';
            var badgeText = alert.isActive ? 'Activa' : 'Inactiva';
            li.innerHTML =
                '<div class="d-flex justify-content-between align-items-start">' +
                    '<div>' +
                        '<strong>' + escapeHtml(alert.title) + '</strong>' +
                        '<span class="badge ' + badgeClass + ' ms-2">' + badgeText + '</span>' +
                        (alert.message ? '<p class="mb-0 text-muted small mt-1">' + escapeHtml(alert.message) + '</p>' : '') +
                    '</div>' +
                    '<span class="text-muted small text-nowrap ms-3">' + dateStr + '</span>' +
                '</div>';

            // Prepend so newest alerts appear at the top
            list.insertBefore(li, list.firstChild);
        }

        // Show a toast notification
        showToast(alert.title, alert.message);

        // Log to status block if available (textContent is used inside, no HTML escaping needed)
        if (typeof window.logAlertStatus === 'function') {
            window.logAlertStatus('Alerta recibida: ' + alert.title, 'text-success');
        }
    }

    connection.on('ReceiveAlert', handleAlert);

    // Legacy handler kept for backward compatibility with hub's SendAlert server-side method.
    // New emissions use ReceiveAlert (handled by handleAlert above).
    connection.on('SendAlert', function (alert) {
        var list = document.getElementById('alerts-list');
        if (!list) return;

        // Remove placeholder if present
        var placeholder = document.getElementById('no-alerts-placeholder');
        if (placeholder) placeholder.remove();

        var now = new Date(alert.createdAt || new Date());
        var dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
            + ' ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        var li = document.createElement('li');
        li.className = 'list-group-item';
        var badgeClass = alert.isActive ? 'bg-success' : 'bg-secondary';
        var badgeText = alert.isActive ? 'Activa' : 'Inactiva';
        li.innerHTML =
            '<div class="d-flex justify-content-between align-items-start">' +
                '<div>' +
                    '<strong>' + escapeHtml(alert.title) + '</strong>' +
                    '<span class="badge ' + badgeClass + ' ms-2">' + badgeText + '</span>' +
                    (alert.message ? '<p class="mb-0 text-muted small mt-1">' + escapeHtml(alert.message) + '</p>' : '') +
                '</div>' +
                '<span class="text-muted small text-nowrap ms-3">' + dateStr + '</span>' +
            '</div>';

        // Prepend so newest alerts appear at the top
        list.insertBefore(li, list.firstChild);

        // Show a toast notification
        showToast(alert.title, alert.message);
    });

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(title, message) {
        var container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '1100';
            document.body.appendChild(container);
        }

        var toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-bg-warning border-0';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML =
            '<div class="d-flex">' +
                '<div class="toast-body">' +
                    '<strong>' + escapeHtml(title) + '</strong>' +
                    (message ? '<br>' + escapeHtml(message) : '') +
                '</div>' +
                '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>' +
            '</div>';

        container.appendChild(toastEl);

        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            var toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
            toastEl.addEventListener('hidden.bs.toast', function () { toastEl.remove(); });
        }
    }

    // Start connection with simple exponential backoff retry
    var retryDelay = 2000;
    var maxRetryDelay = 30000;

    function startConnection() {
        connection.start()
            .then(function () {
                retryDelay = 2000;
            })
            .catch(function () {
                setTimeout(function () {
                    retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
                    startConnection();
                }, retryDelay);
            });
    }

    connection.onclose(function () {
        setTimeout(function () {
            startConnection();
        }, retryDelay);
    });

    startConnection();
})();
