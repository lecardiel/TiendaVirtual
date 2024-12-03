new Vue({
  el: "#app",
  data: {
    meals: [], // Todas las comidas obtenidas de la API
    filteredMeals: [], // Comidas filtradas por búsqueda o categoría
    selectedMeals: [], // Comidas seleccionadas por el usuario
    categories: [], // Lista de categorías
    searchQuery: "", // Término de búsqueda
    selectedCategory: "", // Categoría seleccionada
  },
  computed: {
    // Calcula el porcentaje de la barra de progreso
    progressPercentage() {
      if (this.meals.length === 0) return 0;
      return (this.selectedMeals.length / this.meals.length) * 100;
    },
  },
  methods: {
    // Obtiene todas las comidas desde la API
    fetchMeals() {
      axios
        .get("https://www.themealdb.com/api/json/v1/1/search.php?s=")
        .then((response) => {
          if (response.data.meals) {
            this.meals = response.data.meals;
            this.filteredMeals = this.meals;
          }
        })
        .catch((error) => console.error("Error al cargar comidas:", error));

      // Obtiene las categorías desde la API
      axios
        .get("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then((response) => {
          if (response.data.categories) {
            // Guardar solo los nombres de las categorías
            this.categories = response.data.categories.map(
              (category) => category.strCategory
            );
          }
        })
        .catch((error) => console.error("Error al cargar categorías:", error));
    },

    // Agrega o quita un platillo de la selección
    toggleMealSelection(meal) {
      const index = this.selectedMeals.findIndex((m) => m.idMeal === meal.idMeal);
      if (index === -1) {
        this.selectedMeals.push(meal); // Agregar
      } else {
        this.selectedMeals.splice(index, 1); // Quitar
      }
    },

    // Verifica si un platillo ya está seleccionado
    isMealSelected(meal) {
      return this.selectedMeals.some((m) => m.idMeal === meal.idMeal);
    },

    // Filtrar por categoría
    filterByCategory() {
      if (this.selectedCategory) {
        this.filteredMeals = this.meals.filter(
          (meal) => meal.strCategory === this.selectedCategory
        );
      } else {
        this.filteredMeals = this.meals;
      }
    },

    // Filtrar por nombre
    filterByName() {
      const query = this.searchQuery.toLowerCase();
      this.filteredMeals = this.meals.filter((meal) =>
        meal.strMeal.toLowerCase().includes(query)
      );
    },

    // Manejo de errores de imágenes (si no carga, usa un placeholder)
    handleImageError(event) {
      event.target.src = "https://via.placeholder.com/300x300?text=Sin+imagen";
    },
  },
  created() {
    this.fetchMeals(); // Cargar comidas y categorías al inicializar
  },
});
