class LCG {
    constructor(a, c, m, seed = 0x1234) {
        /*
            m should be a prime and m, c relatively prime
            a-1 divisible by all prime factors of m
            a-1 % 4 == 0 <=> m % 4 == 0
        */
        this.a = a;
        this.c = c;
        this.m = m;
        this.seed = seed;
    }

    seed(seed) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed;
    }
}

class ColorGenerator {
    static work(m) {
        var a = m;
        for (var i = 0; i < 0x132423; i++) {
            a *= 32 - a / 2;
        }
    }

    generate() {
        var milis1 = Date.now();
        this.work(milis1);
        var milis2 = Date.now();
        var diff = milis2-milis1;
        var a = 1664525
        var c = 1013904223
        var m = 1 << 32
        var lcg = new LCG(0,0,0, milis1 ^ diff);
        var r = lcg.next();
        var b = lcg.next();
        var g = lcg.next();
        return [r, b, g];
    }
}