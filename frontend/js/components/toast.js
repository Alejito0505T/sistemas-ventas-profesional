class Toast {

    static mostrar(mensaje, tipo = 'success') {
        let contenedor = document.querySelector('.toast-container');

        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.className = 'toast-container';
            document.body.appendChild(contenedor);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;

        const icono = tipo === 'danger' ? '✕' : tipo === 'warning' ? '⚠' : '✓';
        toast.innerHTML = `${icono} ${mensaje}`;

        contenedor.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static exito(mensaje) {
        this.mostrar(mensaje, 'success');
    }

    static error(mensaje) {
        this.mostrar(mensaje, 'danger');
    }

    static advertencia(mensaje) {
        this.mostrar(mensaje, 'warning');
    }
}