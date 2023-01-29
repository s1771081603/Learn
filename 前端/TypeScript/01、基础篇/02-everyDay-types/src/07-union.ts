function printID01(id: number | string){
    // console.log(id);
    if (typeof id == 'number') {
        console.log(id);
    } else {
        console.log(id.toUpperCase());
    }
}
printID01('songlisheng')
printID01(26)

function welcomePeople01(name: string[] | string) {
    if (Array.isArray(name)) {
        console.log("hello," + name.join(" and "));
    } else {
        console.log("welcome lone traveler" + name);
    }
}
welcomePeople01("a")
welcomePeople01(["a", "b", "c"])