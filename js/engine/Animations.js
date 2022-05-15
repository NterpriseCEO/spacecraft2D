export class Animation {

	//Initialise animation variables
	#currentFrame = 0;
	#animationTimer = 0;
	#frameSize = 0;
	//This variables remebers what frame is playing
	#framesListIndex = 0;

	constructor(frameSize) {
		this.#frameSize = frameSize;
	}

	getFrame() {
		return this.#currentFrame * this.#frameSize;
	}
	animate(start, end, speed) {
		//If timer = 0
		if (this.#animationTimer == 0) {
			//If current frame is not last frame
			if (this.#currentFrame < end) {
				this.#currentFrame++;
			} else {
				//If current frame is last, go to start
				this.#currentFrame = start;
			}
		}
		//If the animataion timer is nt finished
		if (this.#animationTimer < speed) {
			this.#animationTimer++;
		} else {
			//If animation timer is finished
			this.#animationTimer = 0;
		}
	}
	animateList(frames, speed) {
		//Start animation loop
		if (this.#animationTimer == 0) {
			//Checks if animation is not at end of loop
			if (this.#framesListIndex < frames.length) {
				//Sets current frame to frame at framesListIndex
				this.#currentFrame = frames[this.#framesListIndex];
			} else {
				//If at end of animation, go reset animation loop
				this.#framesListIndex = 0;
				//Set current frame to first in loop
				this.#currentFrame = frames[0];
			}
		}
		//Checks if timer has reached end yet
		if (this.#animationTimer < speed) {
			this.#animationTimer++;
		} else {
			//If at end reset timer and increment frame
			this.#animationTimer = 0;
			this.#framesListIndex++;
		}
	}
	stopAnimation() {
		//Stops the animation
		this.#animationTimer = 0;
		this.#framesListIndex = 0;
	}
}
