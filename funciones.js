const { createApp } = Vue;

createApp({
    data() {
        return {
            personajes: [],
            busqueda: "",
            filtroEstado: "",
            filtroGenero: "",
            personajeSeleccionado: null,
            favoritos: [],
            mostrarFavoritos: false,
        }
    },

    mounted() {
        this.obtenerPersonajes();

        if (localStorage.getItem("favoritos")) {
            this.favoritos = JSON.parse(localStorage.getItem("favoritos"));
        }
    },

    computed: {

        personajesFiltrados() {
            return this.personajes.filter(p => {

                const coincideNombre = p.name.toLowerCase()
                    .includes(this.busqueda.toLowerCase());

                const coincideEstado = this.filtroEstado === "" ||
                    p.status === this.filtroEstado;

                const coincideGenero = this.filtroGenero === "" ||
                    p.gender === this.filtroGenero;

                return coincideNombre &&
                       coincideEstado &&
                       coincideGenero;
            });
        },

        porcentaje() {
            if (this.personajes.length === 0) return 0;

            return Math.round(
                (this.personajesFiltrados.length /
                this.personajes.length) * 100
            );
        }
    },

    methods: {

       async obtenerPersonajes() {

    const primera = await fetch(
        "https://rickandmortyapi.com/api/character"
    );

    const data = await primera.json();

    let totalPaginas = data.info.pages;

    let peticiones = [];

    for (let i = 1; i <= totalPaginas; i++) {
        peticiones.push(
            fetch(`https://rickandmortyapi.com/api/character?page=${i}`)
            .then(res => res.json())
        );
    }

    const resultados = await Promise.all(peticiones);

    this.personajes = resultados.flatMap(p => p.results);
},

        mostrarDetalle(personaje) {
            this.personajeSeleccionado = personaje;
        },

       agregarFavorito(personaje) {

    if (!this.favoritos.find(p => p.id === personaje.id)) {

        this.favoritos.push(personaje);

        localStorage.setItem(
            "favoritos",
            JSON.stringify(this.favoritos)
        );
    }
},

        eliminarFavorito(id) {
    this.favoritos = this.favoritos.filter(p => p.id !== id);
    localStorage.setItem("favoritos",
        JSON.stringify(this.favoritos)
    );
},

vaciarFavoritos() {
    this.favoritos = [];
    localStorage.removeItem("favoritos");
},

        claseEstado(estado) {
            return {
                'text-success': estado === 'Alive',
                'text-danger': estado === 'Dead',
                'text-secondary': estado === 'unknown'
            };
        }
    }

}).mount("#app");