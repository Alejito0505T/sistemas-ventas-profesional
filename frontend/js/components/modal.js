class Modal {

    static abrir(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) {
            modal.classList.add('visible');
        }
    }

    static cerrar(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) {
            modal.classList.remove('visible');
        }
    }

    static inicializarCierreAlClickFuera() {
        document.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('modal-overlay')) {
                evento.target.classList.remove('visible');
            }
        });
    }
}