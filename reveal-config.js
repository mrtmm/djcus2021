// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({

    plugins: [
	RevealMarkdown,
	RevealHighlight,
	RevealNotes,
	RevealZoom,
	RevealMenu
    ],

    controls: false,

    progress: true,
    history: true,
    center: true,
    showNotes: false,

    transition: 'none',

    // Advance to the next slide when pressing the return (enter) key
    keyboard: {
	13: 'next'
    },

    menu: {
        themes: true,
        themesPath: 'reveal.js/dist/theme',
        transitions: false,
        openButton: false,
        openSlideNumber: true,
        markers: true
    },

});
