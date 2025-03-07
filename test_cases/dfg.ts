function money_earned(round:number): number {
    switch(round % 3) {
        case 1: 
            return 3
        case 2: 
            return 4
        case 0: 
            return 5
    }
    return 0
}

for (let i = 1; i < 10; i++) {
    console.log(money_earned(i))
}