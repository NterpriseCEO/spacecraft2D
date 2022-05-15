var Key = {
	_pressed: {},

	LEFT: "ArrowLeft",
	UP: "ArrowUp",
	RIGHT: "ArrowRight",
	DOWN: "ArrowDown",

	isDown: function (keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function (event) {
		this._pressed[event.key] = true;
	},

	onKeyup: function (event) {
		delete this._pressed[event.key];
	}
};
window.addEventListener("keyup", function (event) { Key.onKeyup(event); }, false);
window.addEventListener("keydown", function (event) { Key.onKeydown(event); }, false);

export {
	Key
};
