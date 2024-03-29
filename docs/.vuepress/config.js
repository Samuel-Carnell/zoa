const sidebar = require('./sidebar');

module.exports = {
	title: '{{ name }}',
	base: '/',
	themeConfig: {
		repo: '{{ repo }}',
		editLinks: false,
		nav: [],
		sidebar: sidebar,
		sidebarDepth: 0,
	},
};
