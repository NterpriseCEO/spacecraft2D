export class Planet {

	static size = 30;

	generateShadow(world, shadowMap) {
		for (let y = 0; y < 1000; y++) {
			for (let x = 0; x < 1000; x++) {
				let x5 = x - 5,
					x4 = x - 4,
					x3 = x - 3,
					x2 = x - 2,
					x1 = x - 1,
					x5_5 = x + 5,
					x4_4 = x + 4,
					x3_3 = x + 3,
					x2_2 = x + 2,
					x1_1 = x + 1;
	
				if (world[y][x].id != "air") {
					if (x == 0) {
						x1 = 999;
						x2 = 998;
						x3 = 997;
						x4 = 996;
						x5 = 995;
					} else if (x == 1) {
						x2 = 999;
						x3 = 998;
						x4 = 997;
						x5 = 996;
					} else if (x == 2) {
						x3 = 999;
						x4 = 998;
						x5 = 997;
					} else if (x == 3) {
						x4 = 999;
						x5 = 998;
					} else if (x == 4) {
						x5 = 999;
					} else if (x == 999) {
						x1_1 = 0;
						x2_2 = 1;
						x3_3 = 2;
						x4_4 = 3;
						x5_5 = 4;
					} else if (x >= 998) {
						x2_2 = 0;
						x3_3 = 1;
						x4_4 = 2;
						x5_5 = 3;
					} else if (x >= 997) {
						x3_3 = 0;
						x4_4 = 1;
						x5_5 = 2;
					} else if (x >= 996) {
						x4_4 = 0;
						x5_5 = 1;
					} else if (x >= 995) {
						x5_5 = 0;
					}
				}
				if (world[y][x].id != "water") {
					try {
						if ((world[y][x1_1].id == "air" || world[y][x1].id == "air" || world[y + 1][x].id == "air" || world[y - 1][x].id == "air") && world[y][x].id != "air") {
							shadowMap[y][x] = null;
						} else if ((world[y][x2_2].id == "air" || world[y][x2].id == "air" || world[y + 2][x].id == "air" || world[y - 2][x].id == "air") && world[y][x].id != "air") {
							shadowMap[y][x] = [0.2, "black"];
						} else if ((world[y][x3_3].id == "air" || world[y][x3].id == "air" || world[y + 3][x].id == "air" || world[y - 3][x].id == "air") && world[y][x].id != "air") {
							shadowMap[y][x] = [0.4, "black"];
						} else if ((world[y][x4_4].id == "air" || world[y][x4].id == "air" || world[y + 4][x].id == "air" || world[y - 4][x].id == "air") && world[y][x].id != "air") {
							shadowMap[y][x] = [0.6, "black"];
						} else if ((world[y][x5_5].id == "air" || world[y][x5].id == "air" || world[y + 5][x].id == "air" || world[y - 5][x].id == "air") && world[y][x].id != "air") {
							shadowMap[y][x] = [0.8, "black"];
						} else if (world[y][x].id != "air") {
							shadowMap[y][x] = [0.9, "black"];
						}
					} catch (e) {
						//Nothing here
					}
				}
			}
		}
	}
}