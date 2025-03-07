"use strict";
function money_earned(round) {
    switch (round % 3) {
        case 1:
            return 3;
        case 2:
            return 4;
        case 0:
            return 5;
    }
    return 0;
}
for (var i = 1; i < 10; i++) {
    console.log(money_earned(i));
}
