# Simulador Quiz

Una aplicación web estática (Single Page Application) diseñada para simular exámenes y cuestionarios. Este proyecto fue construido inicialmente como un simulador de exámenes de matemáticas, pero es fácilmente adaptable a cualquier temática actualizando el banco de preguntas.

## Características Principales

*   **Modo Práctica:** Permite responder preguntas a tu propio ritmo, sin límite de tiempo.
*   **Modo Examen:** Inicia un temporizador estricto de 30 minutos. Al agotarse el tiempo, la prueba finaliza de forma automática.
*   **Navegación Intuitiva:** Un panel lateral (o inferior en móviles) permite saltar entre cualquier pregunta y visualizar rápidamente cuáles han sido respondidas y cuáles faltan.
*   **Revisión Detallada:** Al finalizar el test, se muestra el puntaje final, el tiempo invertido y un desglose completo pregunta por pregunta, contrastando la respuesta del usuario con la correcta y mostrando una explicación.
*   **Estado Persistente en Memoria:** Las respuestas seleccionadas se mantienen guardadas mientras navegas entre preguntas, permitiéndote cambiar tus selecciones antes de finalizar la prueba.
*   **Diseño Responsivo:** Completamente adaptable a dispositivos móviles, tablets y escritorios utilizando CSS Grid y Flexbox.

## Tecnologías Utilizadas

Este proyecto se desarrolló cumpliendo con estrictos requisitos técnicos, sin dependencias externas:

*   **HTML5 Semántico**
*   **CSS3 Puro** (Uso de CSS Variables, Flexbox, CSS Grid y micro-animaciones). No se utilizaron frameworks como Tailwind o Bootstrap.
*   **Vanilla JavaScript (ES6+)**. Sin frameworks (React, Vue, etc.) ni TypeScript.

## Instalación y Uso Local

Debido a que la aplicación utiliza la API `fetch` de JavaScript para cargar asincrónicamente el banco de preguntas (`questions.json`), **no puede ejecutarse simplemente haciendo doble clic en el archivo `index.html`** (esto causaría un error de CORS en la mayoría de los navegadores modernos). 

Es necesario levantar un servidor local para probar la aplicación.

### Opción 1: Usando Python (Recomendado)
Si tienes Python instalado en tu sistema, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Python 3
python -m http.server 8000
```
Luego, abre tu navegador y visita: `http://localhost:8000`

### Opción 2: Usando Node.js
Si prefieres usar Node.js, puedes usar herramientas como `http-server`:
```bash
npx http-server -p 8000
```

### Opción 3: Usando VS Code
Si utilizas Visual Studio Code, puedes instalar la extensión **Live Server**. Simplemente haz clic derecho sobre el archivo `index.html` y selecciona "Open with Live Server".

## Personalización del Banco de Preguntas

Las preguntas no están quemadas en el código fuente. Se cargan desde el archivo `questions.json`.
Para modificar las preguntas, edita dicho archivo asegurándote de seguir el siguiente esquema JSON para cada pregunta:

```json
{
  "id": "q_001",
  "topic": "Nombre del Tema",
  "question": "¿Pregunta de ejemplo?",
  "options": [
    "Opción A",
    "Opción B",
    "Opción C",
    "Opción D"
  ],
  "correct_index": 0, 
  "explanation": "Explicación de por qué la respuesta es correcta."
}
```
*(Nota: `correct_index` corresponde al índice base 0 del arreglo de `options`)*.

## Despliegue en GitHub Pages

Al ser una aplicación 100% estática, su despliegue en [GitHub Pages](https://pages.github.com/) es directo:

1.  Crea un repositorio en GitHub y sube los archivos de este proyecto (incluyendo `index.html`, `styles.css`, `app.js` y `questions.json`).
2.  En GitHub, ve a **Settings** > **Pages**.
3.  Bajo **Build and deployment**, selecciona **Deploy from a branch**.
4.  En la sección de Branch, selecciona la rama principal (ej. `main` o `master`) y la carpeta `/(root)`.
5.  Haz clic en **Save**. ¡En pocos minutos tu aplicación estará en vivo!
